import { PrismaService } from '../prisma/prisma.service';
export declare class NotificationsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(user: any): Promise<{
        id: string;
        shopId: string | null;
        createdAt: Date;
        type: string;
        title: string;
        message: string;
        isRead: boolean;
        userId: string | null;
    }[]>;
    markAsRead(id: string): Promise<{
        id: string;
        shopId: string | null;
        createdAt: Date;
        type: string;
        title: string;
        message: string;
        isRead: boolean;
        userId: string | null;
    }>;
    markAllAsRead(user: any): Promise<import("@prisma/client").Prisma.BatchPayload>;
    create(data: {
        title: string;
        message: string;
        type: string;
        shopId?: string;
        userId?: string;
    }): Promise<{
        id: string;
        shopId: string | null;
        createdAt: Date;
        type: string;
        title: string;
        message: string;
        isRead: boolean;
        userId: string | null;
    }>;
}
