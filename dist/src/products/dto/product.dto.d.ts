export declare class CreateProductDto {
    name: string;
    description?: string;
    price: number;
    stock: number;
    images?: string[];
}
export declare class UpdateProductDto {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    images?: string[];
}
