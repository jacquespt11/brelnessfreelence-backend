export declare class CreateDiscountDto {
    code: string;
    type?: string;
    value: number;
    minAmount?: number;
    maxUses?: number;
    isActive?: boolean;
    expiresAt?: string;
}
export declare class UpdateDiscountDto {
    code?: string;
    type?: string;
    value?: number;
    minAmount?: number;
    maxUses?: number;
    isActive?: boolean;
    expiresAt?: string;
}
