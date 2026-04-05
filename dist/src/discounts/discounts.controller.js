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
exports.DiscountsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const discounts_service_1 = require("./discounts.service");
const discount_dto_1 = require("./dto/discount.dto");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const subscription_guard_1 = require("../auth/subscription.guard");
let DiscountsController = class DiscountsController {
    discountsService;
    constructor(discountsService) {
        this.discountsService = discountsService;
    }
    async validateCode(shopId, code, total) {
        const cartTotal = parseFloat(total) || 0;
        return this.discountsService.validateCode(shopId, code, cartTotal);
    }
    findByShop(req) {
        return this.discountsService.findByShop(req.user.shopId);
    }
    create(req, createDiscountDto) {
        return this.discountsService.create(req.user.shopId, createDiscountDto);
    }
    update(id, req, updateDiscountDto) {
        return this.discountsService.update(id, req.user.shopId, updateDiscountDto);
    }
    remove(id, req) {
        return this.discountsService.remove(id, req.user.shopId);
    }
};
exports.DiscountsController = DiscountsController;
__decorate([
    (0, common_1.Get)('shop/:shopId/validate'),
    __param(0, (0, common_1.Param)('shopId')),
    __param(1, (0, common_1.Query)('code')),
    __param(2, (0, common_1.Query)('total')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], DiscountsController.prototype, "validateCode", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SHOP_ADMIN'),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DiscountsController.prototype, "findByShop", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard, subscription_guard_1.SubscriptionGuard),
    (0, roles_decorator_1.Roles)('SHOP_ADMIN'),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, discount_dto_1.CreateDiscountDto]),
    __metadata("design:returntype", void 0)
], DiscountsController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard, subscription_guard_1.SubscriptionGuard),
    (0, roles_decorator_1.Roles)('SHOP_ADMIN'),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, discount_dto_1.UpdateDiscountDto]),
    __metadata("design:returntype", void 0)
], DiscountsController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard, subscription_guard_1.SubscriptionGuard),
    (0, roles_decorator_1.Roles)('SHOP_ADMIN'),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], DiscountsController.prototype, "remove", null);
exports.DiscountsController = DiscountsController = __decorate([
    (0, common_1.Controller)('discounts'),
    __metadata("design:paramtypes", [discounts_service_1.DiscountsService])
], DiscountsController);
//# sourceMappingURL=discounts.controller.js.map