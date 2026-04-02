import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

// Note: 'variants' and 'isService'/'durationMin' are new fields added via prisma db push.
// TypeScript types will refresh after the next successful `prisma generate` (requires stopping the server).
// In the meantime, `as any` casts allow the runtime to work correctly.

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // ── Public / Shop Admin ────────────────────────────────────
  async findByShop(shopId: string, search?: string) {
    return this.prisma.product.findMany({
      where: {
        shopId,
        ...(search
          ? { name: { contains: search, mode: 'insensitive' } }
          : {}),
      },
      include: { variants: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, incrementView = false) {
    if (incrementView) {
      await this.prisma.product.update({
        where: { id },
        data: { views: { increment: 1 } },
      }).catch((e: any) => console.error("Error incrementing view:", e));
    }
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { shop: true, variants: true },
    });
    if (!product) throw new NotFoundException('Produit introuvable');
    return product;
  }

  // ── Shop Admin : own shop products only ────────────────────
  async create(shopId: string, dto: CreateProductDto) {
    const { variants, ...productData } = dto;
    return this.prisma.product.create({
      data: {
        ...productData,
        shopId,
        variants: variants && variants.length > 0
          ? { create: variants.map(v => ({ name: v.name, price: v.price, stock: v.stock })) }
          : undefined,
      },
      include: { variants: true },
    });
  }

  async update(id: string, shopId: string, dto: UpdateProductDto) {
    const product = await this.findOne(id);
    if (product.shopId !== shopId)
      throw new ForbiddenException('Accès refusé');

    const { variants, ...productData } = dto;

    return this.prisma.product.update({
      where: { id },
      data: {
        ...productData,
        variants: variants
          ? {
              deleteMany: {},
              create: variants.map(v => ({ name: v.name, price: v.price, stock: v.stock })),
            }
          : undefined,
      },
      include: { variants: true },
    });
  }

  async remove(id: string, shopId: string) {
    const product = await this.findOne(id);
    if (product.shopId !== shopId)
      throw new ForbiddenException('Accès refusé');
    return this.prisma.product.delete({ where: { id } });
  }

  // ── Super Admin ────────────────────────────────────────────
  async findAll(search?: string) {
    return this.prisma.product.findMany({
      where: search
        ? { name: { contains: search, mode: 'insensitive' } }
        : undefined,
      include: {
        shop: { select: { id: true, name: true, slug: true } },
        variants: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async adminUpdate(id: string, dto: UpdateProductDto) {
    await this.findOne(id);
    const { variants, ...productData } = dto;
    return this.prisma.product.update({
      where: { id },
      data: {
        ...productData,
        variants: variants
          ? {
              deleteMany: {},
              create: variants.map(v => ({ name: v.name, price: v.price, stock: v.stock })),
            }
          : undefined,
      },
    });
  }

  async adminRemove(id: string) {
    await this.findOne(id);
    return this.prisma.product.delete({ where: { id } });
  }
}
