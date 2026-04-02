export declare class ProductVariantDto {
    id?: string;
    name: string;
    price?: number;
    stock: number;
}
export declare class CreateProductDto {
    name: string;
    description?: string;
    price: number;
    stock: number;
    images?: string[];
    category?: string;
    isService?: boolean;
    durationMin?: number;
    variants?: ProductVariantDto[];
}
export declare class UpdateProductDto {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    images?: string[];
    category?: string;
    isService?: boolean;
    durationMin?: number;
    variants?: ProductVariantDto[];
}
