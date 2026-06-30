import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SUBSCRIPTION_PLANS, PlanType } from '@aventuras/shared';
import { PaymentProvider, SubscriptionStatus, SubscriptionPlan } from '@prisma/client';
import { MercadoPagoProvider } from './providers/mercado-pago.provider';

/**
 * PaymentsService — maneja el flujo de Mercado Pago para suscripciones.
 */
@Injectable()
export class PaymentsService {
  private logger = new Logger('PaymentsService');

  constructor(
    private prisma: PrismaService,
    private readonly mercadoPagoProvider: MercadoPagoProvider,
  ) {}

  // ─── MERCADO PAGO ─────────────────────────────────────────────────────────────

  /**
   * Crea una Preference de Mercado Pago para redirigir al checkout.
   * No usa PLAN_ID ni planes preaprobados: cada compra genera una preference nueva.
   */
  async createMercadoPagoSubscription(params: {
    userId: string;
    planType: PlanType;
    payerEmail: string;
    backUrl: string; // URL de retorno después del pago
  }) {
    const { userId, planType, payerEmail, backUrl } = params;
    const subscriptionPlan = SUBSCRIPTION_PLANS.find((plan) => plan.type === planType);

    if (!subscriptionPlan) {
      throw new BadRequestException('Plan de suscripción inválido');
    }

    const webhookBaseUrl = process.env.MP_WEBHOOK_URL?.trim();
    const defaultWebhookUrl = `http://localhost:${process.env.PORT ?? 3001}/api/payments/mp/webhook`;
    const notificationUrl = webhookBaseUrl || defaultWebhookUrl;
    const planLabelMap: Record<PlanType, string> = {
      monthly: 'EduPlay Explorador Mensual',
      yearly: 'EduPlay Explorador Anual',
      family: 'EduPlay Familia',
    };
    const unitPrice = Number((subscriptionPlan.price / 100).toFixed(2));
    const { preferenceId, checkoutUrl } = await this.mercadoPagoProvider.createCheckout({
      userId,
      planType,
      payerEmail,
      successUrl: backUrl,
      cancelUrl: backUrl,
      title: planLabelMap[planType],
      unitPrice,
      currencyId: process.env.MP_CURRENCY_ID?.trim() || 'ARS',
      notificationUrl,
    });

    await this.prisma.subscription.upsert({
      where: { userId },
      create: {
        userId,
        provider: PaymentProvider.MERCADO_PAGO,
        mpSubscriptionId: null,
        mpPreapprovalPlanId: planType,
        status: SubscriptionStatus.FREE, // Se actualizará via webhook cuando el pago se confirme
        plan: subscriptionPlan.interval === 'year' ? SubscriptionPlan.ANNUAL : SubscriptionPlan.MONTHLY,
      },
      update: {
        provider: PaymentProvider.MERCADO_PAGO,
        mpSubscriptionId: null,
        mpPreapprovalPlanId: planType,
        plan: subscriptionPlan.interval === 'year' ? SubscriptionPlan.ANNUAL : SubscriptionPlan.MONTHLY,
      },
    });

    return {
      preferenceId,
      checkoutUrl,
      status: 'pending',
    };
  }

  /**
   * Procesa un webhook de Mercado Pago.
   * MP envía notificaciones de tipo IPN (Instant Payment Notification).
   *
   * Docs: https://www.mercadopago.com.ar/developers/es/docs/subscriptions/additional-content/notifications
   */
  async handleMercadoPagoWebhook(topic: string, resourceId: string) {
    // Verificar idempotencia
    const existing = await this.prisma.webhookEvent.findUnique({
      where: {
        provider_externalId: {
          provider: PaymentProvider.MERCADO_PAGO,
          externalId: resourceId,
        },
      },
    });

    if (existing?.processed) {
      this.logger.log(`Webhook MP ya procesado: ${resourceId}`);
      return;
    }

    // Registrar el evento
    await this.prisma.webhookEvent.upsert({
      where: {
        provider_externalId: {
          provider: PaymentProvider.MERCADO_PAGO,
          externalId: resourceId,
        },
      },
      create: {
        provider: PaymentProvider.MERCADO_PAGO,
        externalId: resourceId,
        type: topic,
        processed: false,
      },
      update: { type: topic },
    });

    // Obtener detalle del recurso desde la API de MP
    if (topic === 'payment') {
      await this.syncMercadoPagoPayment(resourceId);
    }

    // Marcar como procesado
    await this.prisma.webhookEvent.update({
      where: {
        provider_externalId: {
          provider: PaymentProvider.MERCADO_PAGO,
          externalId: resourceId,
        },
      },
      data: { processed: true },
    });
  }

  private async updateSubscriptionFromMercadoPago(payment: any) {
    const statusMap: Record<string, SubscriptionStatus> = {
      approved: SubscriptionStatus.ACTIVE,
      paid: SubscriptionStatus.ACTIVE,
      in_process: SubscriptionStatus.PAST_DUE,
      pending: SubscriptionStatus.FREE,
      rejected: SubscriptionStatus.CANCELLED,
      cancelled: SubscriptionStatus.CANCELLED,
      refunded: SubscriptionStatus.CANCELLED,
      charged_back: SubscriptionStatus.CANCELLED,
    };

    const newStatus = statusMap[payment.status] ?? SubscriptionStatus.FREE;
    const rawReference = String(payment.external_reference ?? '');
    const [referenceUserId, referencePlanType] = rawReference.split(':');
    const userId = String(payment.metadata?.userId ?? referenceUserId ?? '').trim();
    const planType = String(payment.metadata?.planType ?? referencePlanType ?? '').trim() as PlanType;
    const subscriptionPlan = SUBSCRIPTION_PLANS.find((plan) => plan.type === planType);

    if (!userId) {
      this.logger.warn(`Pago MP sin userId para el pago ${payment.id}`);
      return;
    }

    const paidAt = payment.date_approved ? new Date(payment.date_approved) : new Date();
    const currentPeriodStart = paidAt;
    const currentPeriodEnd = new Date(paidAt);
    currentPeriodEnd.setDate(
      currentPeriodEnd.getDate() + (subscriptionPlan?.interval === 'year' ? 365 : 30),
    );

    await this.prisma.subscription.upsert({
      where: { userId },
      create: {
        userId,
        provider: PaymentProvider.MERCADO_PAGO,
        mpCustomerId: String(payment.payer?.id ?? payment.customer_id ?? payment.card?.id ?? ''),
        mpSubscriptionId: String(payment.id ?? ''),
        mpPreapprovalPlanId: planType || null,
        status: newStatus,
        plan:
          subscriptionPlan?.interval === 'year' ? SubscriptionPlan.ANNUAL : SubscriptionPlan.MONTHLY,
        currentPeriodStart: newStatus === SubscriptionStatus.ACTIVE ? currentPeriodStart : null,
        currentPeriodEnd: newStatus === SubscriptionStatus.ACTIVE ? currentPeriodEnd : null,
        cancelAtPeriodEnd: false,
      },
      update: {
        provider: PaymentProvider.MERCADO_PAGO,
        mpCustomerId: String(payment.payer?.id ?? payment.customer_id ?? payment.card?.id ?? ''),
        mpSubscriptionId: String(payment.id ?? ''),
        mpPreapprovalPlanId: planType || null,
        status: newStatus,
        plan:
          subscriptionPlan?.interval === 'year' ? SubscriptionPlan.ANNUAL : SubscriptionPlan.MONTHLY,
        currentPeriodStart: newStatus === SubscriptionStatus.ACTIVE ? currentPeriodStart : null,
        currentPeriodEnd: newStatus === SubscriptionStatus.ACTIVE ? currentPeriodEnd : null,
        cancelAtPeriodEnd: false,
      },
    });

    this.logger.log(`Pago MP procesado: ${payment.id} → ${newStatus}`);
  }

  async syncMercadoPagoPayment(paymentId: string) {
    const mpAccessToken = process.env.MP_ACCESS_TOKEN?.trim();
    if (!mpAccessToken) {
      throw new BadRequestException('Mercado Pago no está configurado');
    }

    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${mpAccessToken}` },
    });

    if (!response.ok) {
      const errorText = await response.text();
      this.logger.error(`Error consultando pago de Mercado Pago ${paymentId}: ${errorText}`);
      throw new BadRequestException('No se pudo sincronizar el pago con Mercado Pago');
    }

    const payment = await response.json();
    await this.updateSubscriptionFromMercadoPago(payment);

    return {
      paymentId,
      status: payment.status,
    };
  }

  // ─── ESTADO DE SUSCRIPCIÓN ────────────────────────────────────────────────────

  async getSubscriptionByUserId(userId: string) {
    return this.prisma.subscription.findUnique({ where: { userId } });
  }

  async isUserPremium(userId: string): Promise<boolean> {
    const sub = await this.getSubscriptionByUserId(userId);
    return sub?.status === SubscriptionStatus.ACTIVE;
  }
}
