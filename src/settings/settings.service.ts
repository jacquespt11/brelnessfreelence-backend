import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SystemSettings } from '@prisma/client';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

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
    return this.prisma.systemSettings.update({
      where: { id: settings.id },
      data
    });
  }
}
