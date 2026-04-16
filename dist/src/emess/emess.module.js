"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmessModule = void 0;
const common_1 = require("@nestjs/common");
const emess_service_1 = require("./emess.service");
let EmessModule = class EmessModule {
};
exports.EmessModule = EmessModule;
exports.EmessModule = EmessModule = __decorate([
    (0, common_1.Module)({
        providers: [emess_service_1.EmessService],
        exports: [emess_service_1.EmessService],
    })
], EmessModule);
//# sourceMappingURL=emess.module.js.map