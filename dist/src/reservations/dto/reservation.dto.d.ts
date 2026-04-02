export declare enum ReservationStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}
export declare class CreateReservationDto {
    productId: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    notes?: string;
    quantity: number;
    variantId?: string;
    bookingDate?: Date;
    bookingSlot?: string;
    discountCode?: string;
}
export declare class UpdateReservationStatusDto {
    status: ReservationStatus;
}
