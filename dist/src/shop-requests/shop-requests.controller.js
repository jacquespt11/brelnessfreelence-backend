"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopRequestsController = void 0;
const common_1 = require("@nestjs/common");
const shop_requests_service_1 = require("./shop-requests.service");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
let ShopRequestsController = class ShopRequestsController {
    shopRequestsService;
    constructor(shopRequestsService) {
        this.shopRequestsService = shopRequestsService;
    }
    create(body) {
        return this.shopRequestsService.create(body);
    }
    findAll() {
        return this.shopRequestsService.findAll();
    }
    updateStatus(id, body) {
        return this.shopRequestsService.updateStatus(id, body.status);
    }
};
exports.ShopRequestsController = ShopRequestsController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Soumettre une demande de création de boutique (Public)' }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ShopRequestsController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Lister toutes les demandes (Super Admin)' }),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ShopRequestsController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour le statut dune demande (Super Admin)' }),
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ShopRequestsController.prototype, "updateStatus", null);
exports.ShopRequestsController = ShopRequestsController = __decorate([
    (0, swagger_1.ApiTags)('shop-requests'),
    (0, common_1.Controller)('shop-requests'),
    __metadata("design:paramtypes", [shop_requests_service_1.ShopRequestsService])
], ShopRequestsController);
//# sourceMappingURL=shop-requests.controller.js.map