"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopRequestsModule = void 0;
const common_1 = require("@nestjs/common");
const shop_requests_controller_1 = require("./shop-requests.controller");
const shop_requests_service_1 = require("./shop-requests.service");
const prisma_module_1 = require("../prisma/prisma.module");
const notifications_module_1 = require("../notifications/notifications.module");
let ShopRequestsModule = class ShopRequestsModule {
};
exports.ShopRequestsModule = ShopRequestsModule;
exports.ShopRequestsModule = ShopRequestsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, notifications_module_1.NotificationsModule],
        controllers: [shop_requests_controller_1.ShopRequestsController],
        providers: [shop_requests_service_1.ShopRequestsService],
    })
], ShopRequestsModule);
//# sourceMappingURL=shop-requests.module.js.map