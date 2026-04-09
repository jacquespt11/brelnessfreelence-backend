import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID') || 'mock_client_id',
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') || 'mock_client_secret',
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL') || 'http://localhost:3001/api/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { emails } = profile;
    const email = emails[0].value;

    // Seuls les utilisateurs existants en BDD peuvent se connecter avec Google
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      return done(
        new UnauthorizedException('Accès refusé. Demandez une création de boutique pour accéder à Brelness.'),
        false,
      );
    }
    
    // Si l'utilisateur est inactif
    if (user.status !== 'active') {
      return done(new UnauthorizedException('Votre compte est désactivé.'), false);
    }

    done(null, user);
  }
}
