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
exports.ValidateGenericRequestPipe = void 0;
const common_1 = require("@nestjs/common");
const client_exception_1 = require("../models/exceptions/client.exception");
const request_dto_1 = require("../models/dto/request.dto");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
/**
 * Validates the incoming request as GenericRequest
 */
let ValidateGenericRequestPipe = class ValidateGenericRequestPipe {
    constructor(_options, _validatorOptions = {
        whitelist: true,
        forbidNonWhitelisted: true,
    }) {
        this._options = _options;
        this._validatorOptions = _validatorOptions;
    }
    transform(value) {
        var _a, _b, _c, _d, _e, _f, _g;
        // if the incoming request was not converted into a json format throw a 415 error
        if (typeof value !== 'object')
            throw new client_exception_1.ClientException('Unsupported Media Type', 'The request given body did not resolve into: application/json', 415);
        const type = ((_b = (_a = this._options) === null || _a === void 0 ? void 0 : _a.type) !== null && _b !== void 0 ? _b : (_c = this._options) === null || _c === void 0 ? void 0 : _c.clientIdRequired)
            ? request_dto_1.GenericClientRequest
            : request_dto_1.GenericRequest;
        // Instantiate the GenericRequest class and transfer all incoming values to it for validation
        // The class is instantiated since the NPM-package class-validator won't work otherwise
        const genericRequest = (0, class_transformer_1.plainToClass)(type, value);
        // Check for errors and if any found, generate the error message and throw it
        const validationErrors = (0, class_validator_1.validateSync)(genericRequest, this._validatorOptions);
        if (validationErrors.length > 0) {
            const errorMessage = (_f = (_e = (_d = this._options) === null || _d === void 0 ? void 0 : _d.errorMessageFactory) === null || _e === void 0 ? void 0 : _e.call(_d, validationErrors)) !== null && _f !== void 0 ? _f : Object.values((_g = validationErrors[0].constraints) !== null && _g !== void 0 ? _g : {})[0];
            throw new client_exception_1.ClientException('Bad Request', errorMessage, 400);
        }
        // If everything is ok, return the value
        return value;
    }
};
ValidateGenericRequestPipe = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object, Object])
], ValidateGenericRequestPipe);
exports.ValidateGenericRequestPipe = ValidateGenericRequestPipe;
