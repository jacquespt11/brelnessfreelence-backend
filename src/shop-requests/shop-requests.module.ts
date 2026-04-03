import { Module } from '@nestjs/common';
import { ShopRequestsController } from './shop-requests.controller';
import { ShopRequestsService } from './shop-requests.service';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PrismaModule, NotificationsModule],
  controllers: [ShopRequestsController],
  providers: [ShopRequestsService],
})
export class ShopRequestsModule {}
