export declare class EmessService {
    private readonly logger;
    private readonly baseUrl;
    private readonly appId;
    private readonly secretKey;
    private accessToken;
    private getAccessToken;
    sendAdminCredentialsSms(phone: string, name: string, email: string, rawPassword: string): Promise<any>;
    sendStoreNotification(phone: string, storeName: string): Promise<any>;
    sendSms(phoneNumber: string, content: string): Promise<any>;
}
