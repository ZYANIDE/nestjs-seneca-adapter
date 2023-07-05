"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.senecaVersionExtractor = void 0;
const common_1 = require("@nestjs/common");
const senecaVersionExtractor = (request) => {
    var _a, _b;
    return (_b = (_a = request.version) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : common_1.VERSION_NEUTRAL;
};
exports.senecaVersionExtractor = senecaVersionExtractor;
