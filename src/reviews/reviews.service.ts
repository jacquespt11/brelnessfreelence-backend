import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async findAllByShop(shopId: string) {
    return this.prisma.review.findMany({
      where: { shopId },
      include: { product: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async toggleStatus(id: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');
    return this.prisma.review.update({
      where: { id },
      data: { status: review.status === 'published' ? 'hidden' : 'published' }
    });
  }
}
