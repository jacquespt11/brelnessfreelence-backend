import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly service;
    constructor(service: NotificationsService);
    findAll(req: any): Promise<{
        id: string;
        shopId: string | null;
        createdAt: Date;
        title: string;
        message: string;
        type: string;
        isRead: boolean;
        userId: string | null;
    }[]>;
    markAllAsRead(req: any): Promise<import("@prisma/client").Prisma.BatchPayload>;
    markAsRead(id: string): Promise<{
        id: string;
        shopId: string | null;
        createdAt: Date;
        title: string;
        message: string;
        type: string;
        isRead: boolean;
        userId: string | null;
    }>;
}
