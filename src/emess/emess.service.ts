import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class EmessService {
  private readonly logger = new Logger(EmessService.name);
  private readonly baseUrl = 'https://emess.cd/api/v0';

  // Identifiants Brelness
  private readonly appId = 'Akbaefrk';
  private readonly secretKey = '9b9MBQ7uewHUtBTu8_23IS5F7g_bm3G4';

  // Systeme de cache
  private accessToken: string | null = null;

  /**
   * Recupere ou reutilise le jeton JWT (Cache In-Memory)
   */
  private async getAccessToken(): Promise<string> {
    if (this.accessToken) {
      return this.accessToken;
    }

    try {
      this.logger.log("Demande d'un nouveau token Emess...");
      const response = await axios.post(`${this.baseUrl}/auth/token`, {
        appId: this.appId,
        secretKey: this.secretKey,
      });

      this.accessToken = response.data.token;
      return this.accessToken as string;
    } catch (error: any) {
      this.logger.error("Erreur d'authentification Emess", error.response?.data);
      throw new HttpException("Erreur service SMS", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Envoi d'une notification avec identifiants pour les nouveaux administrateurs
   */
  async sendAdminCredentialsSms(phone: string, name: string, email: string, rawPassword: string): Promise<any> {
    const lines = [
      `Bienvenue sur Brelness, ${name} !`,
      `Votre Cpte Admin est cree.`,
      `ID: ${email}`,
      `Mdp: ${rawPassword}`,
      `Connectez-vous sur brelness.com/login et modifiez votre Mdp pour la securite.`,
    ];
    const message = lines.join('\n');
    return this.sendSms(phone, message);
  }

  /**
   * Envoi d'une notification apres creation de boutique (generique)
   */
  async sendStoreNotification(phone: string, storeName: string): Promise<any> {
    const message = `Brelness : Votre boutique "${storeName}" a ete creee avec succes !`;
    return this.sendSms(phone, message);
  }

  /**
   * Methode generique d'envoi de SMS
   */
  async sendSms(phoneNumber: string, content: string): Promise<any> {
    try {
      const token = await this.getAccessToken();

      // Formatage du numero
      let formattedNumber = phoneNumber.replace(/\s+/g, '');
      if (!formattedNumber.startsWith('+')) {
        formattedNumber = '+' + formattedNumber;
      }

      const payload = {
        number: formattedNumber,
        message: content,
        type: 'standard',
        keepDiacritics: false,
      };

      const response = await axios.post(
        `${this.baseUrl}/sms/send`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      this.logger.log('[Emess SMS] Message envoye avec succes au ' + formattedNumber);
      return response.data;
    } catch (error: any) {
      // Si le token est invalide (expire), on le vide et on reessaie une fois
      if (error.response?.status === 401) {
        this.accessToken = null;
        this.logger.warn("Token expire, tentative de reconnexion...");
        return this.sendSms(phoneNumber, content);
      }

      this.logger.error("Echec de l'envoi SMS", error.response?.data || error.message);
      // Ne pas bloquer l'application si le SMS echoue
      return null;
    }
  }
}
