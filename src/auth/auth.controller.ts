import { Controller, Post, Get, Patch, Delete, Param, Body, UseGuards, Request, Res as Reply } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { AuthService } from './auth.service';

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
  constructor(private authService: AuthService) {}

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

  @ApiOperation({ summary: 'Redirection vers la mire Google (OAuth2)' })
  @Get('google')
  async googleAuth(@Request() req: any, @Reply() reply: any) {
    // Fastify ne supporte pas le redirect Passport nativement
    // On redirige manuellement vers Google OAuth2
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId || clientId === 'mock_client_id') {
      reply.status(503).send({ message: 'Google OAuth non configuré. Ajoutez GOOGLE_CLIENT_ID dans les variables Railway.' });
      return;
    }
    const callbackUrl = encodeURIComponent(process.env.GOOGLE_CALLBACK_URL || 'https://brelnessfreelence-backend-production.up.railway.app/api/auth/google/callback');
    const scope = encodeURIComponent('email profile');
    const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${callbackUrl}&response_type=code&scope=${scope}&access_type=offline`;
    reply.redirect(googleUrl);
  }

  @ApiOperation({ summary: 'Callback Google post-auth' })
  @Get('google/callback')
  async googleAuthRedirect(@Request() req: any, @Reply() reply: any) {
    // Ce callback sera implémenté correctement une fois GOOGLE_CLIENT_ID configuré
    reply.status(501).send({ message: 'Implémentation complète disponible après configuration Google Cloud Console.' });
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
