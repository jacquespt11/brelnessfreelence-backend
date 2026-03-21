import { PrismaService } from '../prisma/prisma.service';
import { SystemSettings } from '@prisma/client';
export declare class SettingsService {
    private prisma;
    constructor(prisma: PrismaService);
    getSettings(): Promise<SystemSettings>;
    updateSettings(data: Partial<SystemSettings>): Promise<SystemSettings>;
}
