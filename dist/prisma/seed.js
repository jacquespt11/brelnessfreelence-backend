"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding Database...');
    const hashedSuperPassword = await bcrypt.hash('superadmin123', 10);
    const superAdmin = await prisma.user.upsert({
        where: { email: 'super@brelness.com' },
        update: {},
        create: {
            email: 'super@brelness.com',
            password: hashedSuperPassword,
            name: 'Super Administrateur',
            role: 'SUPER_ADMIN',
        },
    });
    console.log(`Created Super Admin: ${superAdmin.email}`);
    const shop = await prisma.shop.upsert({
        where: { slug: 'demo-shop' },
        update: {},
        create: {
            name: 'Boutique Démo',
            slug: 'demo-shop',
            category: 'vêtements',
            status: 'active',
        },
    });
    console.log(`Created Shop: ${shop.name} (${shop.slug})`);
    const hashedShopPassword = await bcrypt.hash('shopadmin123', 10);
    const shopAdmin = await prisma.user.upsert({
        where: { email: 'admin@demoshop.com' },
        update: {},
        create: {
            email: 'admin@demoshop.com',
            password: hashedShopPassword,
            name: 'Admin Démo',
            role: 'SHOP_ADMIN',
            shopId: shop.id,
        },
    });
    console.log(`Created Shop Admin: ${shopAdmin.email}`);
    const productsCount = await prisma.product.count({ where: { shopId: shop.id } });
    if (productsCount === 0) {
        await prisma.product.createMany({
            data: [
                {
                    shopId: shop.id,
                    name: 'Robe d\'été florale',
                    description: 'Robe légère parfaite pour les jours ensoleillés.',
                    price: 45000,
                    stock: 20,
                    images: ['https://images.unsplash.com/photo-1515347619362-e6fd8ce06708?q=80&w=600&auto=format&fit=crop'],
                },
                {
                    shopId: shop.id,
                    name: 'T-shirt basique blanc',
                    description: '100% coton bio.',
                    price: 15000,
                    stock: 50,
                    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600&auto=format&fit=crop'],
                },
                {
                    shopId: shop.id,
                    name: 'Veste en Jean Vintage',
                    description: 'Style intemporel en denim robuste.',
                    price: 85000,
                    stock: 15,
                    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop'],
                },
                {
                    shopId: shop.id,
                    name: 'Sneakers Urbaines',
                    description: 'Confort et style pour la ville.',
                    price: 120000,
                    stock: 30,
                    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop'],
                }
            ],
        });
        console.log(`Created 4 demo products for ${shop.name}`);
    }
    else {
        console.log(`Products already exist for ${shop.name}`);
    }
    console.log('Seeding finished.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map