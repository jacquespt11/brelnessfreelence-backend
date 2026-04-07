import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  shopId?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService, config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET') || 'brelness_secret_change_me',
    });
  }

  async validate(payload: JwtPayload) {
    // Toujours recharger l'utilisateur depuis la DB pour avoir un shopId à jour
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, role: true, shopId: true, status: true }
    });

    if (!user || user.status?.toLowerCase() !== 'active') {
      throw new UnauthorizedException('Compte inactif ou introuvable.');
    }

    return {
      userId: user.id,
      email: user.email,
      role: user.role,
      shopId: user.shopId, // Toujours frais depuis la DB
    };
  }
}
