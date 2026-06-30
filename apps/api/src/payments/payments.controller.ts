import {
  Controller,
  Post,
  Body,
  Headers,
  Logger,
  Get,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type { PlanType } from '@aventuras/shared';
import { PaymentsService } from './payments.service';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { UsersService } from '../users/users.service';

interface CreateMpSubscriptionBody {
  planType: PlanType;
  backUrl: string;
}

interface SyncMpPaymentBody {
  paymentId: string;
}

@Controller('payments')
export class PaymentsController {
  private logger = new Logger('PaymentsController');

  constructor(
    private paymentsService: PaymentsService,
    private usersService: UsersService,
  ) {}

  /**
   * Obtener el estado de suscripción del usuario actual
   * GET /api/payments/subscription
   */
  @Get('subscription')
  @UseGuards(SupabaseAuthGuard)
  async getSubscription(@Request() req: any) {
    const userId = req.user?.userId;
    return this.paymentsService.getSubscriptionByUserId(userId);
  }

  // ─── MERCADO PAGO ─────────────────────────────────────────────────────────────

  /**
   * Crear suscripción con Mercado Pago (para usuarios LATAM)
   * POST /api/payments/mp/subscribe
   *
   * Body: { planType: string, backUrl: string }
   */
  @Post('mp/subscribe')
  @UseGuards(SupabaseAuthGuard)
  async createMercadoPagoSubscription(
    @Request() req: any,
    @Body() body: CreateMpSubscriptionBody,
  ) {
    const user = await this.usersService.getOrCreateUser(req.user, {});
    return this.paymentsService.createMercadoPagoSubscription({
      userId: user.id,
      planType: body.planType,
      payerEmail: user.email,
      backUrl: body.backUrl,
    });
  }

  /**
   * Webhook de Mercado Pago (IPN — Instant Payment Notification)
   * POST /api/payments/mp/webhook
   *
   * MP envía: query params ?topic=preapproval&id=RESOURCE_ID
   * No requiere autenticación (se valida por secreto de URL configurado en MP)
   */
  @Post('mp/webhook')
  @HttpCode(HttpStatus.OK)
  async handleMercadoPagoWebhook(
    @Body() body: any,
    @Headers('x-signature') signature: string,
  ) {
    const topic = body?.type ?? body?.topic ?? '';
    const resourceId = body?.data?.id ?? body?.id ?? '';

    this.logger.log(`Webhook MP recibido: topic=${topic}, id=${resourceId}`);

    if (!topic || !resourceId) {
      return { received: true };
    }

    await this.paymentsService.handleMercadoPagoWebhook(topic, resourceId);
    return { received: true };
  }

  /**
   * Sincronizar manualmente un pago aprobado de Mercado Pago.
   * Útil para que la pantalla de éxito pueda confirmar el pago en local.
   */
  @Post('mp/sync')
  @UseGuards(SupabaseAuthGuard)
  async syncMercadoPagoPayment(@Body() body: SyncMpPaymentBody) {
    return this.paymentsService.syncMercadoPagoPayment(body.paymentId);
  }
}
