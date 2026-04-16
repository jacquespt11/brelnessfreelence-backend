"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var EmessService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmessService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
let EmessService = EmessService_1 = class EmessService {
    logger = new common_1.Logger(EmessService_1.name);
    baseUrl = 'https://emess.cd/api/v0';
    appId = 'Akbaefrk';
    secretKey = '9b9MBQ7uewHUtBTu8_23IS5F7g_bm3G4';
    accessToken = null;
    async getAccessToken() {
        if (this.accessToken) {
            return this.accessToken;
        }
        try {
            this.logger.log("Demande d'un nouveau token Emess...");
            const response = await axios_1.default.post(`${this.baseUrl}/auth/token`, {
                appId: this.appId,
                secretKey: this.secretKey,
            });
            this.accessToken = response.data.token;
            return this.accessToken;
        }
        catch (error) {
            this.logger.error("Erreur d'authentification Emess", error.response?.data);
            throw new common_1.HttpException("Erreur service SMS", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async sendAdminCredentialsSms(phone, name, email, rawPassword) {
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
    async sendStoreNotification(phone, storeName) {
        const message = `Brelness : Votre boutique "${storeName}" a ete creee avec succes !`;
        return this.sendSms(phone, message);
    }
    async sendSms(phoneNumber, content) {
        try {
            const token = await this.getAccessToken();
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
            const response = await axios_1.default.post(`${this.baseUrl}/sms/send`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            this.logger.log('[Emess SMS] Message envoye avec succes au ' + formattedNumber);
            return response.data;
        }
        catch (error) {
            if (error.response?.status === 401) {
                this.accessToken = null;
                this.logger.warn("Token expire, tentative de reconnexion...");
                return this.sendSms(phoneNumber, content);
            }
            this.logger.error("Echec de l'envoi SMS", error.response?.data || error.message);
            return null;
        }
    }
};
exports.EmessService = EmessService;
exports.EmessService = EmessService = EmessService_1 = __decorate([
    (0, common_1.Injectable)()
], EmessService);
//# sourceMappingURL=emess.service.js.map