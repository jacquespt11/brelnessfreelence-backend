import { PrismaService } from '../prisma/prisma.service';
import { CreateReservationDto, UpdateReservationStatusDto } from './dto/reservation.dto';
import { NotificationsGateway } from '../notifications/notifications.gateway';
export declare class ReservationsService {
    private prisma;
    private notifications;
    constructor(prisma: PrismaService, notifications: NotificationsGateway);
    create(shopId: string, dto: CreateReservationDto): Promise<{
        productId: string;
        customerName: string;
        quantity: number;
        status: string;
        id: string;
        shopId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findByShop(shopId: string): Promise<({
        product: {
            name: string;
            price: number;
            images: string[];
        };
    } & {
        productId: string;
        customerName: string;
        quantity: number;
        status: string;
        id: string;
        shopId: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    updateStatus(id: string, shopId: string, dto: UpdateReservationStatusDto): Promise<{
        productId: string;
        customerName: string;
        quantity: number;
        status: string;
        id: string;
        shopId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string, shopId: string): Promise<{
        productId: string;
        customerName: string;
        quantity: number;
        status: string;
        id: string;
        shopId: string;
        createdAt: Date;
        updatedAt: Date;
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
        productId: string;
        customerName: string;
        quantity: number;
        status: string;
        id: string;
        shopId: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
}
