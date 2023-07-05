"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const respond_util_1 = require("../utils/respond.util");
const client_exception_1 = require("../models/exceptions/client.exception");
/**
 * https://docs.nestjs.com/exception-filters
 * Exception filters can be used to catch errors that were not manually caught by the application
 * This exception filter uses the default respond() function to respond to the given request
 * It also logs any non-client error it comes across
 */
let DefaultExceptionFilter = class DefaultExceptionFilter {
    catch(error) {
        if (!(error instanceof client_exception_1.ClientException))
            common_1.Logger.error(error);
        return (0, respond_util_1.respond)(error);
    }
};
DefaultExceptionFilter = __decorate([
    (0, common_1.Catch)()
], DefaultExceptionFilter);
exports.DefaultExceptionFilter = DefaultExceptionFilter;
