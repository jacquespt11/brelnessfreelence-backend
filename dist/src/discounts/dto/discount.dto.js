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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDiscountDto = exports.CreateDiscountDto = void 0;
const class_validator_1 = require("class-validator");
class CreateDiscountDto {
    code;
    type;
    value;
    minAmount;
    maxUses;
    isActive;
    expiresAt;
}
exports.CreateDiscountDto = CreateDiscountDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDiscountDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['PERCENT', 'FIXED']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDiscountDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateDiscountDto.prototype, "value", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateDiscountDto.prototype, "minAmount", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateDiscountDto.prototype, "maxUses", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateDiscountDto.prototype, "isActive", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDiscountDto.prototype, "expiresAt", void 0);
class UpdateDiscountDto {
    code;
    type;
    value;
    minAmount;
    maxUses;
    isActive;
    expiresAt;
}
exports.UpdateDiscountDto = UpdateDiscountDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDiscountDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['PERCENT', 'FIXED']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDiscountDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateDiscountDto.prototype, "value", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateDiscountDto.prototype, "minAmount", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateDiscountDto.prototype, "maxUses", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateDiscountDto.prototype, "isActive", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDiscountDto.prototype, "expiresAt", void 0);
//# sourceMappingURL=discount.dto.js.map