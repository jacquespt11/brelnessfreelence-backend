import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto, UpdateTicketStatusDto } from './dto/ticket.dto';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  async create(shopId: string, dto: CreateTicketDto) {
    return this.prisma.supportTicket.create({
      data: {
        shopId,
        type: dto.type,
        subject: dto.subject,
        description: dto.description,
      },
    });
  }

  async findByShop(shopId: string) {
    return this.prisma.supportTicket.findMany({
      where: { shopId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Super Admin only
  async findAllGlobal() {
    return this.prisma.supportTicket.findMany({
      include: {
        shop: { select: { id: true, name: true, slug: true, email: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Super Admin updates status
  async updateStatus(id: string, dto: UpdateTicketStatusDto) {
    const ticket = await this.prisma.supportTicket.findUnique({ where: { id } });
    if (!ticket) throw new NotFoundException('Ticket introuvable');
    return this.prisma.supportTicket.update({
      where: { id },
      data: { status: dto.status },
    });
  }
}
