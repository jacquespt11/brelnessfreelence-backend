import { Module } from '@nestjs/common';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { DiscountsModule } from '../discounts/discounts.module';

@Module({
  imports: [NotificationsModule, DiscountsModule],
  controllers: [ReservationsController],
  providers: [ReservationsService],
  exports: [ReservationsService],
})
export class ReservationsModule {}
