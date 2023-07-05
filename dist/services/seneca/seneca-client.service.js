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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SenecaClient = void 0;
const seneca_1 = __importDefault(require("seneca"));
const common_1 = require("@nestjs/common");
const app_settings_service_1 = require("../app-settings/app-settings.service");
/**
 * SenecaClient is used to communicate with other Seneca clients from other services
 * You can connect with other client with the connect() method and communicate with them using the act() method
 */
let SenecaClient = class SenecaClient {
    constructor(_appSettings) {
        this._appSettings = _appSettings;
        this._senecaInstance = (0, seneca_1.default)({ log: 'silent' });
    }
    /**
     * With this method you can connect to other Seneca client of other services
     *
     * @param client Options needed to connect to other Seneca clients
     */
    connect(client) {
        var _a, _b, _c, _d;
        (_a = client.type) !== null && _a !== void 0 ? _a : (client.type = (_b = this._appSettings.snapshot().seneca.listener.type) !== null && _b !== void 0 ? _b : 'http');
        this._senecaInstance.client({
            type: client.type,
            port: client.port,
            host: client.host,
            pin: (_c = client.pin) !== null && _c !== void 0 ? _c : undefined,
        });
        common_1.Logger.log(`SenecaClient connected to [${(_d = client.name) !== null && _d !== void 0 ? _d : 'UNNAMED SERVICE'}] at: ${client.type}://${client.host}:${client.port}${client.pin ? `#${client.pin}` : ''}`);
    }
    /**
     * With this method the current service can send requests to other Seneca clients it has connected to
     *
     * @param pattern Used by other Seneca clients to identify if they should respond to request
     * @param data Data send with the request
     */
    async act(pattern, data) {
        return new Promise((resolve, reject) => {
            this._senecaInstance.act(pattern, data, (error, result) => {
                if (error)
                    return reject(error);
                resolve(result);
            });
        });
    }
    /**
     * Responsible for the teardown logic of the SenecaClient
     */
    onModuleDestroy() {
        return new Promise((resolve, reject) => {
            try {
                this._senecaInstance.close(resolve);
            }
            catch (e) {
                reject(e);
            }
        });
    }
};
SenecaClient = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [app_settings_service_1.AppSettings])
], SenecaClient);
exports.SenecaClient = SenecaClient;
