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
exports.GenericClientRequest = exports.GenericRequest = exports.ClientRequest = exports.SenecaPayloadRequest = exports.SenecaRequest = void 0;
const class_validator_1 = require("class-validator");
/**
 * A class representing a SenecaRequest to attach validation rules to its properties
 */
class SenecaRequest {
}
__decorate([
    (0, class_validator_1.ValidateIf)((req) => !req.action),
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SenecaRequest.prototype, "cmd", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((req) => !req.cmd),
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SenecaRequest.prototype, "action", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SenecaRequest.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SenecaRequest.prototype, "version", void 0);
__decorate([
    (0, class_validator_1.Allow)(),
    __metadata("design:type", Object)
], SenecaRequest.prototype, "transport$", void 0);
__decorate([
    (0, class_validator_1.Allow)(),
    __metadata("design:type", Object)
], SenecaRequest.prototype, "tx$", void 0);
exports.SenecaRequest = SenecaRequest;
/**
 * A class representing a PayloadRequest over Seneca to attach validation rules to its properties
 */
class SenecaPayloadRequest extends SenecaRequest {
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], SenecaPayloadRequest.prototype, "payload", void 0);
exports.SenecaPayloadRequest = SenecaPayloadRequest;
/**
 * A class representing a ClientRequest over Seneca to attach validation rules to its properties
 */
class ClientRequest extends SenecaPayloadRequest {
}
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsNumber)({
        allowInfinity: false,
        allowNaN: false,
        maxDecimalPlaces: 0,
    }),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], ClientRequest.prototype, "clientId", void 0);
exports.ClientRequest = ClientRequest;
/**
 * A class representing a GenericRequest over Seneca to attach validation rules to its properties
 */
class GenericRequest extends SenecaPayloadRequest {
}
exports.GenericRequest = GenericRequest;
/**
 * A class representing a GenericClientRequest over Seneca to attach validation rules to its properties
 */
class GenericClientRequest extends ClientRequest {
}
exports.GenericClientRequest = GenericClientRequest;
