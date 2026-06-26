import {
  Controller,
  Post,
  Body,
  Headers,
  Logger,
  Req,
  BadRequestException,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  private logger = new Logger('PaymentsController');

  constructor(private paymentsService: PaymentsService) {}

  /**
   * Create a checkout session
   * POST /payments/create-checkout-session
   */
  @Post('create-checkout-session')
  async createCheckoutSession(
    @Body()
    body: {
      priceId: string;
      userId: string;
      successUrl: string;
      cancelUrl: string;
    },
  ) {
    try {
      return await this.paymentsService.createCheckoutSession(
        body.priceId,
        body.userId,
        body.successUrl,
        body.cancelUrl,
      );
    } catch (error) {
      this.logger.error('Error in createCheckoutSession:', error);
      throw error;
    }
  }

  /**
   * Create a billing portal session
   * POST /payments/create-portal-session
   */
  @Post('create-portal-session')
  async createBillingPortalSession(
    @Body() body: { customerId: string; returnUrl: string },
  ) {
    try {
      return await this.paymentsService.createBillingPortalSession(
        body.customerId,
        body.returnUrl,
      );
    } catch (error) {
      this.logger.error('Error in createBillingPortalSession:', error);
      throw error;
    }
  }

  /**
   * Webhook endpoint for Stripe events
   * POST /payments/webhook
   */
  @Post('webhook')
  async handleWebhook(
    @Req() req: RawBodyRequest<any>,
    @Headers('stripe-signature') signature: string,
  ) {
    const body = req.rawBody;
    if (!body || !signature) {
      throw new BadRequestException('Missing Stripe webhook body or signature');
    }

    try {
      const event = this.paymentsService.verifyWebhookEvent(body, signature);
      this.logger.log(`Received webhook event: ${event.type}`);

      switch (event.type) {
        case 'checkout.session.completed':
          await this.paymentsService.handleCheckoutSessionCompleted(
            event.data.object as any,
          );
          break;
        case 'invoice.paid':
          await this.paymentsService.handleInvoicePaid(event.data.object as any);
          break;
        case 'customer.subscription.updated':
          await this.paymentsService.handleSubscriptionUpdated(
            event.data.object as any,
          );
          break;
        case 'customer.subscription.deleted':
          await this.paymentsService.handleSubscriptionDeleted(
            event.data.object as any,
          );
          break;
        default:
          this.logger.log(`Unhandled event type: ${event.type}`);
      }

      return { received: true };
    } catch (error) {
      this.logger.error('Webhook error:', error);
      throw error;
    }
  }
}
