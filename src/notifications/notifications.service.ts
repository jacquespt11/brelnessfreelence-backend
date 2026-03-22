import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async findAll(user: any) {
    if (user.role === 'SUPER_ADMIN') {
      return this.prisma.notification.findMany({ 
        where: { 
          shopId: null,
          type: { not: 'reservation' }
        }, 
        orderBy: { createdAt: 'desc' } 
      });
    }
    return this.prisma.notification.findMany({ 
      where: { shopId: user.shopId }, 
      orderBy: { createdAt: 'desc' } 
    });
  }

  async markAsRead(id: string) {
    return this.prisma.notification.update({ 
      where: { id }, 
      data: { isRead: true } 
    });
  }

  async markAllAsRead(user: any) {
    if (user.role === 'SUPER_ADMIN') {
      return this.prisma.notification.updateMany({ 
        where: { 
          shopId: null, 
          isRead: false,
          type: { not: 'reservation' }
        }, 
        data: { isRead: true } 
      });
    }
    return this.prisma.notification.updateMany({ 
      where: { shopId: user.shopId, isRead: false }, 
      data: { isRead: true } 
    });
  }

  async create(data: { title: string, message: string, type: string, shopId?: string, userId?: string }) {
    return this.prisma.notification.create({ data });
  }
}
