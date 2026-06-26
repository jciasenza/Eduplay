import { BadRequestException, Injectable, Logger } from '@nestjs/common';

interface ContactMessage {
  name: string;
  email: string;
  topic: string;
  message: string;
}

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);
  private readonly supportEmail = process.env.CONTACT_TO_EMAIL || 'curejuan@hotmail.com';
  private readonly fromEmail =
    process.env.CONTACT_FROM_EMAIL || 'EduPlay <onboarding@resend.dev>';

  async sendContactMessage(message: ContactMessage) {
    const cleanMessage = this.validateMessage(message);
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      this.logger.warn('RESEND_API_KEY is not configured. Contact email was not sent.');
      throw new BadRequestException('Email provider is not configured');
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: this.fromEmail,
        to: [this.supportEmail],
        reply_to: cleanMessage.email,
        subject: `Consulta EduPlay - ${cleanMessage.topic}`,
        text: this.buildPlainTextEmail(cleanMessage),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      this.logger.error(`Resend email failed: ${errorText}`);
      throw new BadRequestException('Could not send contact email');
    }

    return { sent: true };
  }

  private validateMessage(message: ContactMessage): ContactMessage {
    const cleanMessage = {
      name: message.name?.trim() ?? '',
      email: message.email?.trim() ?? '',
      topic: message.topic?.trim() ?? '',
      message: message.message?.trim() ?? '',
    };

    if (
      cleanMessage.name.length < 2 ||
      !cleanMessage.email.includes('@') ||
      cleanMessage.topic.length < 2 ||
      cleanMessage.message.length < 10
    ) {
      throw new BadRequestException('Invalid contact message');
    }

    return cleanMessage;
  }

  private buildPlainTextEmail(message: ContactMessage) {
    return [
      'Nueva consulta desde EduPlay',
      '',
      `Nombre: ${message.name}`,
      `Email: ${message.email}`,
      `Motivo: ${message.topic}`,
      '',
      'Mensaje:',
      message.message,
    ].join('\n');
  }
}
