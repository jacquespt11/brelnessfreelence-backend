import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class EmessService {
  private readonly logger = new Logger(EmessService.name);
  private readonly baseUrl = 'https://emess.cd/api/v0';
  
  // Identifiants Brelness
  private readonly appId = 'Akbaefrk';
  private readonly secretKey = '9b9MBQ7uewHUtBTu8_23IS5F7g_bm3G4';

  // Système de cache
  private accessToken: string | null = null;

  /**
   * Récupère ou réutilise le jeton JWT (Cache In-Memory)
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
      return this.accessToken;
    } catch (error: any) {
      this.logger.error("Erreur d'authentification Emess", error.response?.data);
      throw new HttpException("Erreur service SMS", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Envoi d'une notification avec identifiants pour les nouveaux administrateurs
   */
  async sendAdminCredentialsSms(phone: string, name: string, email: string, rawPassword: string) {
    const message = `Bienvenue sur Brelness, ${name} !\nVotre Cpte Admin est créé.\nID: ${email}\nMdp: ${rawPassword}\nConnectez-vous sur brelness.com/login et modifiez votre Mdp pour la sécurité.`;
    return this.sendSms(phone, message);
  }

  /**
   * Envoi d'une notification après création de boutique (générique)
   */
  async sendStoreNotification(phone: string, storeName: string) {
    const message = `Brelness : Votre boutique "${storeName}" a été créée avec succès !`;
    return this.sendSms(phone, message);
  }

  /**
   * Méthode générique d'envoi de SMS
   */
  async sendSms(phoneNumber: string, content: string): Promise<any> {
    try {
      const token = await this.getAccessToken();
      
      // Formatage du numéro pour s'assurer du +243 (et retrait des espaces/caractères superflus)
      let formattedNumber = phoneNumber.replace(/\s+/g, '');
      if (!formattedNumber.startsWith('+')) {
        formattedNumber = \`+\${formattedNumber}\`;
      }

      const payload = {
        number: formattedNumber,
        message: content,
        type: 'standard', // 'critical' peut être utilisé pour des alertes urgentes
        keepDiacritics: false
      };

      const response = await axios.post(
        `${this.baseUrl}/sms/send`,
        payload,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      this.logger.log(`[Emess SMS] Message envoyé avec succès au ${formattedNumber}`);
      return response.data;
    } catch (error: any) {
      // Si le token est invalide (expiré), on le vide et on réessaie une fois
      if (error.response?.status === 401) {
        this.accessToken = null;
        this.logger.warn("Token expiré, tentative de reconnexion...");
        return this.sendSms(phoneNumber, content); 
      }

      this.logger.error("Échec de l'envoi SMS", error.response?.data || error.message);
      // Ne pas bloquer l'application si le SMS échoue
      return null;
    }
  }
}
