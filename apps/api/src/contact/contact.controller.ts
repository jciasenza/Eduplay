import { Body, Controller, Post } from '@nestjs/common';
import { ContactService } from './contact.service';

interface ContactRequestBody {
  name: string;
  email: string;
  topic: string;
  message: string;
}

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async sendContactMessage(@Body() body: ContactRequestBody) {
    return this.contactService.sendContactMessage(body);
  }
}
