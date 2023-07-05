"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var RootModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RootModule = void 0;
const common_1 = require("@nestjs/common");
const app_settings_module_1 = require("../services/app-settings/app-settings.module");
const seneca_module_1 = require("../services/seneca/seneca.module");
let RootModule = RootModule_1 = class RootModule {
    /**
     * Generates a module that will be used as a root module for every project.
     * Because this module is global, everything it exports will automatically be imported in all other submodules
     *
     * @param module Submodule entrypoint
     * @param options App app-settings that will be for some exporting modules
     * @return DynamicModule
     */
    static register(module, options) {
        return {
            module: RootModule_1,
            imports: [app_settings_module_1.AppSettingsModule.register(options), seneca_module_1.SenecaModule, module],
        };
    }
};
RootModule = RootModule_1 = __decorate([
    (0, common_1.Module)({})
], RootModule);
exports.RootModule = RootModule;
