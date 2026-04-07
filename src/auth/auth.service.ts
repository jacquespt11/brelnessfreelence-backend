import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { Resend } from 'resend';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private notifications: NotificationsGateway,
  ) {}

  async register(email: string, password: string, name: string) {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException('Email déjà utilisé');

    const hashed = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: { email, password: hashed, name },
    });

    return this.issueToken(user);
  }

  async login(email: string, password: string) {
    if (!email || !password) {
      throw new BadRequestException('Email et mot de passe sont requis');
    }
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Identifiants invalides');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Identifiants invalides');

    return this.issueToken(user);
  }

  issueToken(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      shopId: user.shopId,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, email: user.email, name: user.name, role: user.role, shopId: user.shopId },
    };
  }

  async findAll() {
    return this.prisma.user.findMany({
      include: { shop: true },
      orderBy: { name: 'asc' }
    });
  }

  async createUser(data: { name: string; email: string; password?: string; shopId?: string; status?: string }) {
    const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new ConflictException('Email déjà utilisé');

    const rawPassword = data.password || 'password123';
    const hashedPassword = await bcrypt.hash(rawPassword, 10);
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        shopId: data.shopId,
        status: data.status || 'active',
        role: Role.SHOP_ADMIN,
      },
    });

    this.notifications.notifySuperAdmins('admin_created', user);
    await this.prisma.notification.create({
      data: {
        title: 'Nouvel Administrateur',
        message: `L'administrateur "${user.name}" a été ajouté.`,
        type: 'system',
      }
    });

    try {
      if (process.env.RESEND_API_KEY) {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: 'Brelness Support <contact@brelness.com>',
          to: data.email,
          subject: 'Vos accès Administrateur Brelness O.S',
          html: `
            <h2>Bienvenue sur Brelness, ${data.name} !</h2>
            <p>Votre compte administrateur a été créé avec succès.</p>
            <p>Voici vos identifiants pour accéder à votre interface de gestion :</p>
            <div style="background-color:#f3f4f6;padding:16px;border-radius:8px;margin:16px 0;">
              <p style="margin:4px 0;"><strong>E-mail :</strong> ${data.email}</p>
              <p style="margin:4px 0;"><strong>Mot de passe :</strong> ${rawPassword}</p>
            </div>
            <p style="color:#d97706;"><strong>Important :</strong> Pour des raisons de sécurité, nous vous invitons fortement à modifier ce mot de passe par défaut dès votre première connexion.</p>
            <br>
            <a href="${process.env.FRONTEND_URL || 'https://brelness.com'}/login" style="display:inline-block;padding:12px 24px;background-color:#2563eb;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:bold;">Se connecter à la plateforme</a>
          `,
        });
        console.log(`[Resend] E-mail de bienvenue envoyé avec succès à ${data.email}`);
      } else {
        console.warn(`[Resend] RESEND_API_KEY manquante. E-mail non envoyé à ${data.email}.`);
      }
    } catch (e) {
      console.error(`[Resend] Erreur critique lors de l'envoi de l'email pour l'admin ${data.email}:`, e);
    }

    return user;
  }

  async updateUser(id: string, data: { name?: string; email?: string; shopId?: string; status?: string; password?: string }) {
    if (data.email) {
      const existing = await this.prisma.user.findFirst({ where: { email: data.email, id: { not: id } } });
      if (existing) throw new ConflictException('Email déjà utilisé');
    }

    const updateData: any = {
      name: data.name,
      email: data.email,
      phone: (data as any).phone,
      avatar: (data as any).avatar,
      shopId: data.shopId,
      status: data.status,
    };

    if (data.password && data.password.trim() !== "") {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
    });
  }

  async toggleUserStatus(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new BadRequestException('Utilisateur introuvable');
    return this.prisma.user.update({
      where: { id },
      data: { status: user.status === 'active' ? 'inactive' : 'active' },
    });
  }

  async deleteUser(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }

  async getMe(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        shopId: true,
        status: true,
        phone: true,
        avatar: true,
      }
    });
  }
}
