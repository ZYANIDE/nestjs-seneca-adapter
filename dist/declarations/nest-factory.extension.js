"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const seneca_application_factory_1 = require("../core/seneca-application.factory");
/**
 * This initializes the declared property of NestFactory so it can be used to create a Seneca Nest microservice application
 */
core_1.NestFactory.createSenecaMicroservice = (module, options) => (0, seneca_application_factory_1.SenecaApplicationFactory)(module, options);
