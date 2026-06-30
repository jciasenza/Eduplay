import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { MercadoPagoProvider } from './providers/mercado-pago.provider';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, MercadoPagoProvider],
  exports: [PaymentsService],
})
export class PaymentsModule {}
