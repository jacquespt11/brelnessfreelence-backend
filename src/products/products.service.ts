import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // ── Public / Shop Admin ────────────────────────────────────
  // List products of a specific shop (public catalog)
  async findByShop(shopId: string, search?: string) {
    return this.prisma.product.findMany({
      where: {
        shopId,
        ...(search
          ? { name: { contains: search, mode: 'insensitive' } }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get a single product (public) – includes shop for the product detail page
  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { shop: true },
    });
    if (!product) throw new NotFoundException('Produit introuvable');
    return product;
  }

  // ── Shop Admin : own shop products only ────────────────────
  async create(shopId: string, dto: CreateProductDto) {
    return this.prisma.product.create({
      data: { ...dto, shopId },
    });
  }

  async update(id: string, shopId: string, dto: UpdateProductDto) {
    const product = await this.findOne(id);
    if (product.shopId !== shopId)
      throw new ForbiddenException('Accès refusé');
    return this.prisma.product.update({ where: { id }, data: dto });
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
      include: { shop: { select: { id: true, name: true, slug: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async adminUpdate(id: string, dto: UpdateProductDto) {
    await this.findOne(id);
    return this.prisma.product.update({ where: { id }, data: dto });
  }

  async adminRemove(id: string) {
    await this.findOne(id);
    return this.prisma.product.delete({ where: { id } });
  }
}
