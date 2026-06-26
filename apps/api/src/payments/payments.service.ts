import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;
  private logger = new Logger('PaymentsService');

  constructor() {
    if (!process.env.STRIPE_SECRET_KEY) {
      this.logger.warn('STRIPE_SECRET_KEY not found in environment variables');
    }
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2022-11-15' as any,
    });
  }

  /**
   * Create a checkout session for subscription or one-time payment
   */
  async createCheckoutSession(
    priceId: string,
    userId: string,
    successUrl: string,
    cancelUrl: string,
  ) {
    try {
      if (!priceId) {
        throw new BadRequestException('priceId is required');
      }

      const session = await this.stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
        client_reference_id: userId,
        metadata: {
          userId,
        },
      });

      return { sessionId: session.id, checkoutUrl: session.url };
    } catch (error) {
      this.logger.error('Error creating checkout session:', error);
      throw error;
    }
  }

  /**
   * Create a billing portal session
   */
  async createBillingPortalSession(customerId: string, returnUrl: string) {
    try {
      if (!customerId) {
        throw new BadRequestException('customerId is required');
      }

      const portalSession = await this.stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      });

      return { portalUrl: portalSession.url };
    } catch (error) {
      this.logger.error('Error creating billing portal session:', error);
      throw error;
    }
  }

  /**
   * Verify webhook signature and return event
   */
  verifyWebhookEvent(body: Buffer, signature: string) {
    try {
      const event = this.stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || '',
      );
      return event;
    } catch (error) {
      this.logger.error('Webhook signature verification failed:', error);
      throw new BadRequestException('Invalid webhook signature');
    }
  }

  /**
   * Handle checkout session completed event
   */
  async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    this.logger.log(
      `Checkout session completed: ${session.id}`,
      JSON.stringify({
        clientRefId: session.client_reference_id,
        customerId: session.customer,
        subscriptionId: session.subscription,
      }),
    );

    // TODO: Update user subscription status in database
    // const userId = session.client_reference_id;
    // const stripeCustomerId = session.customer;
    // const stripeSubscriptionId = session.subscription;
    //
    // await prisma.user.update({
    //   where: { id: userId },
    //   data: {
    //     stripeCustomerId: stripeCustomerId as string,
    //     stripeSubscriptionId: stripeSubscriptionId as string,
    //     subscriptionStatus: 'active',
    //   },
    // });
  }

  /**
   * Handle invoice paid event
   */
  async handleInvoicePaid(invoice: Stripe.Invoice) {
    this.logger.log(
      `Invoice paid: ${invoice.id}`,
      JSON.stringify({
        customerId: invoice.customer,
        subscriptionId: invoice.subscription,
        amount: invoice.amount_paid,
      }),
    );

    // TODO: Update invoice/subscription records
  }

  /**
   * Handle subscription updated event
   */
  async handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    this.logger.log(
      `Subscription updated: ${subscription.id}`,
      JSON.stringify({
        customerId: subscription.customer,
        status: subscription.status,
      }),
    );

    // TODO: Update subscription status in database
  }

  /**
   * Handle subscription deleted event
   */
  async handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    this.logger.log(`Subscription deleted: ${subscription.id}`);

    // TODO: Update subscription status to cancelled
  }
}
