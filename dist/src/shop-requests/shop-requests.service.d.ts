import { PrismaService } from '../prisma/prisma.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
export declare class ShopRequestsService {
    private prisma;
    private notifications;
    private resend;
    constructor(prisma: PrismaService, notifications: NotificationsGateway);
    create(data: {
        name: string;
        email: string;
        phone?: string;
        businessName: string;
        details?: string;
    }): Promise<{
        id: string;
        email: string;
        name: string;
        phone: string | null;
        status: string;
        createdAt: Date;
        businessName: string;
        details: string | null;
    }>;
    findAll(): Promise<{
        id: string;
        email: string;
        name: string;
        phone: string | null;
        status: string;
        createdAt: Date;
        businessName: string;
        details: string | null;
    }[]>;
    updateStatus(id: string, status: string): Promise<{
        id: string;
        email: string;
        name: string;
        phone: string | null;
        status: string;
        createdAt: Date;
        businessName: string;
        details: string | null;
    }>;
}
