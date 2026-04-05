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
exports.UploadController = exports.UploadBase64Dto = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
class UploadBase64Dto {
    filename;
    data;
}
exports.UploadBase64Dto = UploadBase64Dto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UploadBase64Dto.prototype, "filename", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UploadBase64Dto.prototype, "data", void 0);
let UploadController = class UploadController {
    cloudinaryService;
    constructor(cloudinaryService) {
        this.cloudinaryService = cloudinaryService;
    }
    async uploadFile(body) {
        if (!body.data || !body.filename) {
            throw new common_1.HttpException('Missing file or filename', common_1.HttpStatus.BAD_REQUEST);
        }
        const matches = body.data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
            throw new common_1.HttpException('Invalid base64 Data URL', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const buffer = Buffer.from(matches[2], 'base64');
            const result = await this.cloudinaryService.uploadImage(buffer);
            return { url: result.secure_url };
        }
        catch (error) {
            console.error('Upload Error:', error);
            throw new common_1.HttpException('Failed to upload image', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.UploadController = UploadController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UploadBase64Dto]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadFile", null);
exports.UploadController = UploadController = __decorate([
    (0, common_1.Controller)('upload'),
    __metadata("design:paramtypes", [cloudinary_service_1.CloudinaryService])
], UploadController);
//# sourceMappingURL=upload.controller.js.map