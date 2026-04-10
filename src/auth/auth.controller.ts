import { Controller, Post, Get, Patch, Delete, Param, Body, UseGuards, Request, Res as Reply, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './roles.guard';
import axios from 'axios';
import { Roles } from './roles.decorator';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

import { IsEmail, IsString, MinLength } from 'class-validator';

class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(1)
  password!: string;
}

class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsString()
  name!: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService
  ) {}

  @ApiOperation({ summary: 'Connexion' })
  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  @ApiOperation({ summary: 'Inscription' })
  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.authService.register(body.email, body.password, body.name);
  }

  @ApiOperation({ summary: 'Redirection manuelle vers Google OAuth2 (Fastify-compatible)' })
  @Get('google')
  async googleAuth(@Reply() reply: any) {
    const clientId = this.configService.get('GOOGLE_CLIENT_ID');
    const callbackUrl = this.configService.get('GOOGLE_CALLBACK_URL') || 'https://brelnessfreelence-backend-production.up.railway.app/api/auth/google/callback';
    
    if (!clientId || clientId === 'mock_client_id') {
      reply.status(503).send({ message: 'Google OAuth non configuré. Ajoutez GOOGLE_CLIENT_ID dans les variables Railway.' });
      return;
    }

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: callbackUrl,
      response_type: 'code',
      scope: 'email profile',
      access_type: 'offline',
    });

    reply.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
  }

  @ApiOperation({ summary: 'Callback Google OAuth2 - échange du code et émission du JWT' })
  @Get('google/callback')
  async googleAuthRedirect(@Query('code') code: string, @Reply() reply: any) {
    const frontendUrl = this.configService.get('FRONTEND_URL') || 'https://brelness.com';

    if (!code) {
      reply.redirect(`${frontendUrl}/login?error=google_auth_failed`);
      return;
    }

    try {
      const clientId = this.configService.get('GOOGLE_CLIENT_ID');
      const clientSecret = this.configService.get('GOOGLE_CLIENT_SECRET');
      const callbackUrl = this.configService.get('GOOGLE_CALLBACK_URL') || 'https://brelnessfreelence-backend-production.up.railway.app/api/auth/google/callback';

      // 1. Échanger le code contre un access_token Google
      const tokenRes = await axios.post('https://oauth2.googleapis.com/token', {
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: callbackUrl,
        grant_type: 'authorization_code',
      });

      const googleAccessToken = tokenRes.data.access_token;

      // 2. Récupérer le profil Google de l'utilisateur
      const profileRes = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${googleAccessToken}` },
      });
      
      const { email } = profileRes.data;
      const { access_token, user } = await this.authService.loginOrCreateGoogleUser(email, profileRes.data);

      // 3. Rediriger vers le frontend avec les données de session
      const userJson = JSON.stringify({ ...user, token: access_token });
      reply.redirect(`${frontendUrl}/login?oauth_data=${encodeURIComponent(userJson)}`);

    } catch (err: any) {
      console.error('[Google OAuth Callback Error]', err.response?.data || err.message);
      reply.redirect(`${frontendUrl}/login?error=google_auth_failed`);
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Liste tous les utilisateurs (SUPER_ADMIN)' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPER_ADMIN')
  @Get('users')
  findAll() {
    return this.authService.findAll();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un administrateur (SUPER_ADMIN)' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPER_ADMIN')
  @Post('users')
  createUser(@Body() body: any) {
    return this.authService.createUser(body);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier un administrateur (SUPER_ADMIN)' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPER_ADMIN')
  @Patch('users/:id')
  updateUser(@Param('id') id: string, @Body() body: any) {
    return this.authService.updateUser(id, body);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Activer/Désactiver un administrateur (SUPER_ADMIN)' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPER_ADMIN')
  @Patch('users/:id/toggle-status')
  toggleUserStatus(@Param('id') id: string) {
    return this.authService.toggleUserStatus(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un administrateur (SUPER_ADMIN)' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPER_ADMIN')
  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return this.authService.deleteUser(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtenir les infos de l\'utilisateur connecté' })
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMe(@Request() req: any) {
    return this.authService.getMe(req.user.userId);
  }
}
