export declare class CreateShopDto {
    name: string;
    slug: string;
    category: string;
    businessType?: string;
    description?: string;
    email?: string;
    phone?: string;
    address?: string;
}
export declare class UpdateShopDto {
    name?: string;
    slug?: string;
    category?: string;
    businessType?: string;
    description?: string;
    email?: string;
    phone?: string;
    address?: string;
    logo?: string;
    banner?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
    tiktok?: string;
    heroTitle?: string;
    heroImages?: string[];
    isManualOverride?: boolean;
    status?: string;
}
