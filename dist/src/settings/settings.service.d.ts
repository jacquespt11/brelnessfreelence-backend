import { PrismaService } from '../prisma/prisma.service';
import { SystemSettings } from '@prisma/client';
import { NotificationsGateway } from '../notifications/notifications.gateway';
export declare class SettingsService {
    private prisma;
    private notifications;
    constructor(prisma: PrismaService, notifications: NotificationsGateway);
    getSettings(): Promise<SystemSettings>;
    updateSettings(data: Partial<SystemSettings>): Promise<SystemSettings>;
}
