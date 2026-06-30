import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import MercadoPagoConfig, { Preference } from 'mercadopago';
import type { PlanType } from '@aventuras/shared';

export interface CreateCheckoutDto {
  userId: string;
  planType: PlanType;
  payerEmail: string;
  successUrl: string;
  cancelUrl: string;
  title: string;
  unitPrice: number;
  currencyId?: string;
  notificationUrl?: string;
}

@Injectable()
export class MercadoPagoProvider {
  private readonly logger = new Logger(MercadoPagoProvider.name);
  private readonly client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN ?? '',
  });

  async createCheckout(dto: CreateCheckoutDto) {
    if (!process.env.MP_ACCESS_TOKEN) {
      throw new BadRequestException('Mercado Pago no está configurado');
    }

    try {
      const preference = new Preference(this.client);
      const response = await preference.create({
        body: {
          items: [
            {
              id: dto.planType,
              title: dto.title,
              quantity: 1,
              currency_id: dto.currencyId ?? 'ARS',
              unit_price: dto.unitPrice,
            },
          ],
          back_urls: {
            success: dto.successUrl,
            failure: dto.cancelUrl,
            pending: dto.cancelUrl,
          },
          external_reference: dto.userId,
          metadata: {
            userId: dto.userId,
            planType: dto.planType,
            planTitle: dto.title,
          },
          ...(dto.notificationUrl ? { notification_url: dto.notificationUrl } : {}),
          ...(dto.payerEmail ? { payer: { email: dto.payerEmail } } : {}),
        },
      });

      const checkoutUrl = response.init_point ?? response.sandbox_init_point;

      if (!checkoutUrl) {
        throw new BadRequestException('Mercado Pago no devolvió una URL de pago');
      }

      return {
        preferenceId: response.id,
        checkoutUrl,
      };
    } catch (error) {
      const message = this.getMercadoPagoErrorMessage(error);
      this.logError(error, message);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(message);
    }
  }

  private logError(error: unknown, message?: string) {
    if (error instanceof Error) {
      this.logger.error(message ?? error.message, error.stack);
      return;
    }

    this.logger.error(
      message ?? 'Error desconocido creando preference de Mercado Pago',
      JSON.stringify(error),
    );
  }

  private getMercadoPagoErrorMessage(error: unknown) {
    if (error instanceof Error) {
      return error.message;
    }

    if (typeof error === 'string') {
      return error;
    }

    if (error && typeof error === 'object') {
      const details = error as Record<string, unknown>;
      const message = details.message;
      if (typeof message === 'string' && message.trim()) {
        const extra = this.extractExtraErrorDetails(details);
        return extra ? `${message} - ${extra}` : message;
      }

      const extra = this.extractExtraErrorDetails(details);
      if (extra) {
        return extra;
      }
    }

    return 'Error al crear sesión de pago con Mercado Pago';
  }

  private extractExtraErrorDetails(details: Record<string, unknown>) {
    const parts: string[] = [];

    const status = details.status ?? details.statusCode;
    if (typeof status === 'number' || typeof status === 'string') {
      parts.push(`status ${status}`);
    }

    const errorValue = details.error;
    if (typeof errorValue === 'string' && errorValue.trim()) {
      parts.push(errorValue);
    }

    const cause = details.cause;
    if (typeof cause === 'string' && cause.trim()) {
      parts.push(cause);
    } else if (Array.isArray(cause) && cause.length > 0) {
      parts.push(
        cause
          .map((item) => {
            if (!item || typeof item !== 'object') {
              return String(item);
            }
            return JSON.stringify(item);
          })
          .join(', '),
      );
    }

    return parts.join(' | ');
  }
}
