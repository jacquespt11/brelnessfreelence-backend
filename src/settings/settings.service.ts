import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SystemSettings } from '@prisma/client';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class SettingsService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsGateway,
  ) {}

  async getSettings(): Promise<SystemSettings> {
    let settings = await this.prisma.systemSettings.findFirst();
    if (!settings) {
      settings = await this.prisma.systemSettings.create({
        data: {}
      });
    }
    return settings;
  }

  async updateSettings(data: Partial<SystemSettings>): Promise<SystemSettings> {
    const settings = await this.getSettings();
    const updated = await this.prisma.systemSettings.update({
      where: { id: settings.id },
      data
    });

    this.notifications.notifySuperAdmins('system_updated', updated);
    await this.prisma.notification.create({
      data: {
        title: 'Système Mis à Jour',
        message: 'Les paramètres de la plateforme ont été modifiés.',
        type: 'system',
      }
    });

    return updated;
  }
}
