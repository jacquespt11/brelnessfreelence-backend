export declare enum ReservationStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}
export declare class CreateReservationDto {
    productId: string;
    customerName: string;
    quantity: number;
}
export declare class UpdateReservationStatusDto {
    status: ReservationStatus;
}
