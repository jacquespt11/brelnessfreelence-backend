import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleLicenseExpirations() {
    this.logger.debug('Running daily license expiration check...');

    const now = new Date();
    
    // 1. Licenses that are expired -> Move from ACTIVE/WARNING to GRACE_PERIOD
    const expiredLicenses = await this.prisma.license.findMany({
      where: {
        endDate: { lt: now },
        status: { in: ['ACTIVE', 'WARNING'] },
      },
    });

    for (const license of expiredLicenses) {
      this.logger.log(`License ${license.id} (Shop ${license.shopId}) expired. GRACE_PERIOD.`);
      await this.prisma.license.update({
        where: { id: license.id },
        data: { status: 'GRACE_PERIOD' },
      });
      await this.prisma.notification.create({
        data: {
          shopId: license.shopId,
          type: 'license',
          title: 'Licence expirée (Période de grâce)',
          message: 'Votre abonnement a expiré. Votre boutique est passée en mode lecture seule.',
        }
      });
    }

    // 2. Licenses in GRACE_PERIOD > 5 days -> Move to EXPIRED
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
    
    const graceEndedLicenses = await this.prisma.license.findMany({
      where: {
        endDate: { lt: fiveDaysAgo },
        status: 'GRACE_PERIOD',
      },
    });

    for (const license of graceEndedLicenses) {
      this.logger.log(`License ${license.id} ended grace period. EXPIRED.`);
      await this.prisma.license.update({
        where: { id: license.id },
        data: { status: 'EXPIRED' },
      });
      await this.prisma.shop.update({
        where: { id: license.shopId },
        data: { status: 'suspended' },
      });
    }

    // 3. Licenses expiring within 7 days -> Move to WARNING
    const next7Days = new Date();
    next7Days.setDate(next7Days.getDate() + 7);
    
    const warningLicenses = await this.prisma.license.findMany({
      where: {
        endDate: { gt: now, lte: next7Days },
        status: 'ACTIVE',
      },
    });

    for (const license of warningLicenses) {
      this.logger.log(`License ${license.id} entering WARNING period.`);
      await this.prisma.license.update({
        where: { id: license.id },
        data: { status: 'WARNING' },
      });
      await this.prisma.notification.create({
        data: {
          shopId: license.shopId,
          type: 'license',
          title: 'Licence bientôt expirée',
          message: `Votre abonnement expire d'ici 7 jours. Pensez à renouveler.`,
        }
      });
    }
  }
}
