import { SettingsService } from './settings.service';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getSettings(): Promise<{
        id: string;
        updatedAt: Date;
        platformName: string;
        contactEmail: string;
        contactPhone: string | null;
        logoUrl: string | null;
        maintenanceMode: boolean;
    }>;
    updateSettings(data: any): Promise<{
        id: string;
        updatedAt: Date;
        platformName: string;
        contactEmail: string;
        contactPhone: string | null;
        logoUrl: string | null;
        maintenanceMode: boolean;
    }>;
}
