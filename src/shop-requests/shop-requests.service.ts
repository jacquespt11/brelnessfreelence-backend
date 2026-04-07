import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { Resend } from 'resend';

@Injectable()
export class ShopRequestsService {
  private resend: Resend;

  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsGateway,
  ) {
    this.resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key');
  }

  async create(data: { name: string; email: string; phone?: string; businessName: string; details?: string }) {
    if (!data.name || !data.email || !data.businessName) {
      throw new BadRequestException('Nom, email et nom de boutique sont requis.');
    }

    const request = await this.prisma.shopRequest.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        businessName: data.businessName,
        details: data.details,
      },
    });

    // Notify SuperAdmins via Websocket
    this.notifications.notifySuperAdmins('shop_request_created', request);

    // Create a DB Notification
    await this.prisma.notification.create({
      data: {
        title: 'Nouvelle Demande de Plateforme',
        message: `${data.name} (${data.email}) souhaite créer la boutique "${data.businessName}".`,
        type: 'system',
      }
    });

    // Send Email to SuperAdmin (Brelness)
    try {
      if (process.env.RESEND_API_KEY) {
        await this.resend.emails.send({
          from: 'Brelness Onboarding <onboarding@brelness.com>', // Nécessite domaine vérifié sur Resend, ou on fallback
          to: process.env.ADMIN_EMAIL || 'admin@brelness.com',
          subject: `Nouvelle demande de plateforme : ${data.businessName}`,
          html: `
            <h2>Nouvelle demande de création de boutique</h2>
            <p><strong>Nom :</strong> ${data.name}</p>
            <p><strong>Email :</strong> ${data.email}</p>
            <p><strong>Téléphone :</strong> ${data.phone || 'Non renseigné'}</p>
            <p><strong>Nom de la boutique :</strong> ${data.businessName}</p>
            <p><strong>Détails :</strong> ${data.details || 'Aucun'}</p>
            <br/>
            <p>Connectez-vous à votre tableau de bord Brelness pour gérer cette demande.</p>
          `,
        });
      } else {
        console.warn('RESEND_API_KEY manquant. E-mail non envoyé.');
      }
    } catch (e) {
      console.error("Erreur lors de l'envoi de l'email Resend:", e);
    }

    return request;
  }

  async findAll() {
    return this.prisma.shopRequest.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.shopRequest.update({
      where: { id },
      data: { status }
    });
  }
}
