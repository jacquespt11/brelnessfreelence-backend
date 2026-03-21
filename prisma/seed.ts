import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Database...');

  // 1. Create Super Admin
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

  // 2. Create a demo Shop
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

  // 3. Create Shop Admin
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

  // 4. Create sample Products for the Demo Shop
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
  } else {
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
