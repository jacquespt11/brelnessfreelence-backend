import { PrismaService } from '../prisma/prisma.service';
import { CreateReservationDto, UpdateReservationStatusDto } from './dto/reservation.dto';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { DiscountsService } from '../discounts/discounts.service';
export declare class ReservationsService {
    private prisma;
    private notifications;
    private discountsService;
    constructor(prisma: PrismaService, notifications: NotificationsGateway, discountsService: DiscountsService);
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
        notes: string | null;
        quantity: number;
        variantId: string | null;
        bookingDate: Date | null;
        bookingSlot: string | null;
        totalAmount: number | null;
        discountCode: string | null;
    }>;
    findByShop(shopId: string): Promise<({
        product: {
            name: string;
            price: number;
            images: string[];
        };
        variant: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            price: number | null;
            stock: number;
        } | {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            price: number | null;
            stock: number;
        } | null;
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
        notes: string | null;
        quantity: number;
        variantId: string | null;
        bookingDate: Date | null;
        bookingSlot: string | null;
        totalAmount: number | null;
        discountCode: string | null;
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
        notes: string | null;
        quantity: number;
        variantId: string | null;
        bookingDate: Date | null;
        bookingSlot: string | null;
        totalAmount: number | null;
        discountCode: string | null;
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
        notes: string | null;
        quantity: number;
        variantId: string | null;
        bookingDate: Date | null;
        bookingSlot: string | null;
        totalAmount: number | null;
        discountCode: string | null;
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
        notes: string | null;
        quantity: number;
        variantId: string | null;
        bookingDate: Date | null;
        bookingSlot: string | null;
        totalAmount: number | null;
        discountCode: string | null;
    })[]>;
}
