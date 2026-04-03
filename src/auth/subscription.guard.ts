import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    // Si pas de user ou si Super Admin, pas de pb
    if (!user || user.role === 'SUPER_ADMIN') return true;

    // Seules les requêtes de modification (POST, PATCH, PUT, DELETE) sont restreintes
    if (request.method === 'GET' || request.method === 'OPTIONS') return true;

    // Les tickets doivent toujours pouvoir être créés
    if (request.url.includes('/tickets')) return true;

    // Vérification critique : si le shopId est null, on refuse l'accès proprement
    if (!user.shopId) {
      throw new ForbiddenException('Aucune boutique associée à ce compte.');
    }

    // On vérifie le shop
    const shop = await this.prisma.shop.findUnique({
      where: { id: user.shopId },
      include: {
        licenses: {
          orderBy: { endDate: 'desc' },
          take: 1
        }
      }
    });

    if (!shop) return false;

    // Si override manuel, le super admin a autorisé, donc on passe
    if (shop.isManualOverride) return true;

    const currentLicense = shop.licenses[0];
    
    // Si aucune licence ou licence non active/warning -> mode lecture seule
    if (!currentLicense) {
      throw new ForbiddenException("Aucune licence valide. Mode lecture seule.");
    }

    if (currentLicense.status === 'GRACE_PERIOD' || currentLicense.status === 'EXPIRED') {
      throw new ForbiddenException("Période de grâce ou Expirée (Lecture Seule). Veuillez renouveler votre abonnement.");
    }

    return true;
  }
}
