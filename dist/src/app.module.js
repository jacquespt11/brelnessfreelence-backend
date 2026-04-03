"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const shops_module_1 = require("./shops/shops.module");
const products_module_1 = require("./products/products.module");
const reservations_module_1 = require("./reservations/reservations.module");
const notifications_module_1 = require("./notifications/notifications.module");
const cloudinary_module_1 = require("./cloudinary/cloudinary.module");
const upload_module_1 = require("./upload/upload.module");
const settings_module_1 = require("./settings/settings.module");
const reviews_module_1 = require("./reviews/reviews.module");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const schedule_1 = require("@nestjs/schedule");
const tickets_module_1 = require("./tickets/tickets.module");
const tasks_module_1 = require("./tasks/tasks.module");
const discounts_module_1 = require("./discounts/discounts.module");
const shop_requests_module_1 = require("./shop-requests/shop-requests.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            shops_module_1.ShopsModule,
            products_module_1.ProductsModule,
            reservations_module_1.ReservationsModule,
            notifications_module_1.NotificationsModule,
            cloudinary_module_1.CloudinaryModule,
            upload_module_1.UploadModule,
            settings_module_1.SettingsModule,
            reviews_module_1.ReviewsModule,
            schedule_1.ScheduleModule.forRoot(),
            tickets_module_1.TicketsModule,
            tasks_module_1.TasksModule,
            discounts_module_1.DiscountsModule,
            shop_requests_module_1.ShopRequestsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map