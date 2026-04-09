import { Controller, Post, Get, Patch, Delete, Param, Body, UseGuards, Request, Res as Reply } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './roles.guard';
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

  @ApiOperation({ summary: 'Redirection vers la mire Google (OAuth2)' })
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Le garde manipule la redirection vers Google OAuth2 automatiquement.
  }

  @ApiOperation({ summary: 'Callback Google post-auth' })
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Request() req: any, @Reply() reply: any) {
    // Si l'utilisateur est authentifié par GoogleStrategy, req.user contient l'objet User BDD.
    const { access_token, user } = this.authService.issueToken(req.user);
    
    const frontendUrl = this.configService.get('FRONTEND_URL') || 'https://brelness.com';
    const userJson = JSON.stringify({ ...user, token: access_token });
    const encodedUser = encodeURIComponent(userJson);

    // Redirection vers le frontend en injectant les données dans un paramètre d'URL.
    // Le Frontend extraira ces données et les mettra dans le localStorage.
    reply.redirect(`${frontendUrl}/login?oauth_data=${encodedUser}`);
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
