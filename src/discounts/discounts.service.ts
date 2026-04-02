import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDiscountDto, UpdateDiscountDto } from './dto/discount.dto';

@Injectable()
export class DiscountsService {
  constructor(private prisma: PrismaService) {}

  // ── Public / Validation ────────────────────────────────────
  async validateCode(shopId: string, code: string, cartTotal: number) {
    const discount = await (this.prisma as any).discount.findFirst({
      where: { shopId, code, isActive: true },
    });

    if (!discount) {
      throw new NotFoundException('Code promo invalide');
    }

    if (discount.expiresAt && new Date(discount.expiresAt) < new Date()) {
      throw new BadRequestException('Ce code promo a expiré');
    }

    if (discount.maxUses && discount.usedCount >= discount.maxUses) {
      throw new BadRequestException("Ce code promo a atteint sa limite d'utilisation");
    }

    if (discount.minAmount && cartTotal < discount.minAmount) {
      throw new BadRequestException(`Amount minimum requis: ${discount.minAmount} FCFA`);
    }

    return discount;
  }

  // ── Shop Admin : own shop discounts only ────────────────────
  async findByShop(shopId: string) {
    return (this.prisma as any).discount.findMany({
      where: { shopId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(shopId: string, dto: CreateDiscountDto) {
    const existing = await (this.prisma as any).discount.findFirst({
      where: { shopId, code: dto.code },
    });
    if (existing) {
      throw new BadRequestException('Un code avec ce nom existe déjà pour cette boutique');
    }

    return (this.prisma as any).discount.create({
      data: {
        ...dto,
        shopId,
      },
    });
  }

  async update(id: string, shopId: string, dto: UpdateDiscountDto) {
    const discount = await (this.prisma as any).discount.findUnique({
      where: { id },
    });
    if (!discount) throw new NotFoundException('Code promo introuvable');
    if (discount.shopId !== shopId) throw new ForbiddenException('Accès refusé');

    if (dto.code && dto.code !== discount.code) {
      const existing = await (this.prisma as any).discount.findFirst({
         where: { shopId, code: dto.code },
      });
      if (existing) {
         throw new BadRequestException('Un code avec ce nom existe déjà pour cette boutique');
      }
    }

    return (this.prisma as any).discount.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, shopId: string) {
    const discount = await (this.prisma as any).discount.findUnique({
      where: { id },
    });
    if (!discount) throw new NotFoundException('Code promo introuvable');
    if (discount.shopId !== shopId) throw new ForbiddenException('Accès refusé');

    return (this.prisma as any).discount.delete({ where: { id } });
  }

  // Helper function used when an order is successful to increment usedCount
  async incrementUsedCount(id: string) {
    return (this.prisma as any).discount.update({
      where: { id },
      data: {
        usedCount: { increment: 1 }
      }
    });
  }
}
