"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AppSettingsModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppSettingsModule = void 0;
const common_1 = require("@nestjs/common");
const app_settings_service_1 = require("./app-settings.service");
let AppSettingsModule = AppSettingsModule_1 = class AppSettingsModule {
    static register(options) {
        return {
            global: true,
            module: AppSettingsModule_1,
            providers: [
                { provide: app_settings_service_1.AppSettings, useValue: new app_settings_service_1.AppSettings(options) },
            ],
            exports: [app_settings_service_1.AppSettings],
        };
    }
};
AppSettingsModule = AppSettingsModule_1 = __decorate([
    (0, common_1.Module)({})
], AppSettingsModule);
exports.AppSettingsModule = AppSettingsModule;
