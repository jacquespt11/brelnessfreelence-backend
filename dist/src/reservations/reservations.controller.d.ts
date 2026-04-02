import { ReservationsService } from './reservations.service';
import { CreateReservationDto, UpdateReservationStatusDto } from './dto/reservation.dto';
export declare class ReservationsController {
    private reservationsService;
    constructor(reservationsService: ReservationsService);
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
    findMyShopReservations(req: any): Promise<({
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
    findMyShopCustomers(req: any): Promise<any[]>;
    updateStatus(id: string, req: any, dto: UpdateReservationStatusDto): Promise<{
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
    remove(id: string, req: any): Promise<{
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
