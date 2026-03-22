import { PrismaService } from '../prisma/prisma.service';
import { CreateReservationDto, UpdateReservationStatusDto } from './dto/reservation.dto';
import { NotificationsGateway } from '../notifications/notifications.gateway';
export declare class ReservationsService {
    private prisma;
    private notifications;
    constructor(prisma: PrismaService, notifications: NotificationsGateway);
    create(shopId: string, dto: CreateReservationDto): Promise<{
        id: string;
        shopId: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        customerName: string;
        customerPhone: string | null;
        customerEmail: string | null;
        quantity: number;
    }>;
    findByShop(shopId: string): Promise<({
        product: {
            name: string;
            price: number;
            images: string[];
        };
    } & {
        id: string;
        shopId: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        customerName: string;
        customerPhone: string | null;
        customerEmail: string | null;
        quantity: number;
    })[]>;
    getShopCustomers(shopId: string): Promise<any[]>;
    updateStatus(id: string, shopId: string, dto: UpdateReservationStatusDto): Promise<{
        id: string;
        shopId: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        customerName: string;
        customerPhone: string | null;
        customerEmail: string | null;
        quantity: number;
    }>;
    remove(id: string, shopId: string): Promise<{
        id: string;
        shopId: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        customerName: string;
        customerPhone: string | null;
        customerEmail: string | null;
        quantity: number;
    }>;
    findAllGlobal(): Promise<({
        shop: {
            name: string;
            slug: string;
        };
        product: {
            name: string;
        };
    } & {
        id: string;
        shopId: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        customerName: string;
        customerPhone: string | null;
        customerEmail: string | null;
        quantity: number;
    })[]>;
}
