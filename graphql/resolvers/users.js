"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = void 0;
var apollo_server_errors_1 = require("apollo-server-errors");
var Imp_jwt = __importStar(require("jsonwebtoken"));
var moment_1 = __importDefault(require("moment"));
var validators_1 = require("../../util/validators");
var config_1 = require("../../config");
var User_1 = require("../../models/User");
var objectHelper_1 = require("./../../util/objectHelper");
var config_2 = require("../../config");
var Query = {
    getAccess: function (_, body, context) { return __awaiter(void 0, void 0, void 0, function () {
        var vCookieRefreshValue, vCookieRefreshDecoded, vVerifyResponse, vCookieAccessName, vCookieAccessToken_New, err_1, vCookieRefreshName;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    console.log('getAccess triggered');
                    vCookieRefreshValue = objectHelper_1.objectHelper.retrieveCookieValue(context, 'refresh');
                    if (objectHelper_1.objectHelper.isNullOrEmpty(vCookieRefreshValue)) {
                        throw ('Unable to retrieve cookie');
                    }
                    vCookieRefreshDecoded = Imp_jwt.decode(vCookieRefreshValue);
                    if (objectHelper_1.objectHelper.isNullOrEmpty(vCookieRefreshDecoded)
                        || !(vCookieRefreshDecoded instanceof Object)) {
                        throw ('Unable to decode Refresh cookie');
                    }
                    else if ((!objectHelper_1.objectHelper.hasOwnProperty(vCookieRefreshDecoded, '_id')
                        || (objectHelper_1.objectHelper.isNullOrEmpty(vCookieRefreshDecoded._id)))
                        && ((!objectHelper_1.objectHelper.hasOwnProperty(vCookieRefreshDecoded, 'userFullName')
                            || (objectHelper_1.objectHelper.isNullOrEmpty(vCookieRefreshDecoded.userFullName))))) {
                        throw ('Unable to identify _id or userFullName within decoded refresh cookie');
                    }
                    ;
                    return [4, config_1.verifyToken(vCookieRefreshValue, 'refresh')];
                case 1:
                    vVerifyResponse = _a.sent();
                    if (!vVerifyResponse) {
                        throw ('Verification of Refresh cookie has failed');
                    }
                    ;
                    vCookieAccessName = "access";
                    vCookieAccessToken_New = config_1.signToken(vVerifyResponse, vCookieAccessName);
                    if (!vCookieAccessToken_New) {
                        throw ('Unable to sign new Access token');
                    }
                    context.setCookies.push({
                        name: vCookieAccessName,
                        value: vCookieAccessToken_New,
                        options: {
                            expires: moment_1.default().add(20, 'm').toDate(),
                            httpOnly: true,
                            secure: true
                        }
                    });
                    return [2, {
                            status: "successful",
                            userID: vCookieRefreshDecoded._id,
                            userFullName: vCookieRefreshDecoded.userFullName
                        }];
                case 2:
                    err_1 = _a.sent();
                    console.log(err_1);
                    vCookieRefreshName = 'refresh';
                    context.setCookies.push({
                        name: vCookieRefreshName,
                        value: 'expired',
                        options: {
                            expires: moment_1.default().add(-1, 'y').toDate(),
                            httpOnly: true,
                            path: "/auth",
                            secure: true
                        }
                    });
                    return [2, { status: 'unsuccessful' }];
                case 3: return [2];
            }
        });
    }); },
    getLogout: function (_, body, context) { return __awaiter(void 0, void 0, void 0, function () {
        var vCookieRefreshName, vCookieRefreshValue, vCookieAccessName, vCookieAccessValue, vCookieRefreshName;
        return __generator(this, function (_a) {
            try {
                console.log('getLogout triggered');
                vCookieRefreshName = 'refresh';
                vCookieRefreshValue = objectHelper_1.objectHelper.retrieveCookieValue(context, vCookieRefreshName);
                vCookieAccessName = 'access';
                vCookieAccessValue = objectHelper_1.objectHelper.retrieveCookieValue(context, vCookieAccessName);
                context.setCookies.push({
                    name: vCookieRefreshName,
                    value: 'expired',
                    options: {
                        expires: moment_1.default().add(-1, 'y').toDate(),
                        httpOnly: true,
                        path: "/auth",
                        secure: true
                    }
                });
                return [2, {
                        status: "successful"
                    }];
            }
            catch (err) {
                console.log(err);
                vCookieRefreshName = 'refresh';
                context.setCookies.push({
                    name: vCookieRefreshName,
                    value: 'expired',
                    options: {
                        expires: moment_1.default().add(-1, 'y').toDate(),
                        httpOnly: true,
                        path: "/auth",
                        secure: true
                    }
                });
                return [2, { status: 'unsuccessful' }];
            }
            return [2];
        });
    }); }
};
var Mutation = {
    login: function (_, userLoginAttempt, context) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, pErrors, vAuthenticated_User, vIsLoginValid, vCookieRefreshName, vCookieRefreshValue, vCookieRefreshValue_Hashed, vDB_Response, err_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 4, , 5]);
                    return [4, validators_1.validators.validateLoginInput(userLoginAttempt)];
                case 1:
                    _a = _b.sent(), pErrors = _a.vErrors, vAuthenticated_User = _a.vDB_User, vIsLoginValid = _a.vIsLoginValid;
                    if (!vIsLoginValid) {
                        throw new apollo_server_errors_1.UserInputError('Errors', { pErrors: pErrors });
                    }
                    vAuthenticated_User.password = null;
                    vCookieRefreshName = 'refresh';
                    vCookieRefreshValue = config_1.signToken(vAuthenticated_User, vCookieRefreshName);
                    if (!vCookieRefreshValue) {
                        return [2, { status: 'unsuccessful' }];
                    }
                    return [4, config_2.bcryptHash(vCookieRefreshValue, 99)];
                case 2:
                    vCookieRefreshValue_Hashed = _b.sent();
                    return [4, User_1.User.UserSchema_Model.updateOne({ username: vAuthenticated_User.username }, { refreshToken: vCookieRefreshValue_Hashed }, { lean: true })];
                case 3:
                    vDB_Response = _b.sent();
                    if (vDB_Response.nModified < 1) {
                        return [2, { status: 'unsuccessful' }];
                    }
                    context.setCookies.push({
                        name: vCookieRefreshName,
                        value: vCookieRefreshValue,
                        options: {
                            expires: moment_1.default().add(2, 'd').toDate(),
                            httpOnly: true,
                            path: "/auth",
                            secure: true
                        }
                    });
                    return [2, {
                            status: "successful"
                        }];
                case 4:
                    err_2 = _b.sent();
                    console.log(err_2);
                    return [2, { status: "unsuccessful" }];
                case 5: return [2];
            }
        });
    }); },
    register: function (_, body, context, info) { return __awaiter(void 0, void 0, void 0, function () {
        var vRegisterInput, _a, vErrors, vIsRegisterValid, vPassword, vNewUser, vNewUserCreated, err_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 4, , 5]);
                    vRegisterInput = body.registerInput;
                    return [4, validators_1.validators.validateRegisterInput(vRegisterInput)];
                case 1:
                    _a = _b.sent(), vErrors = _a.vErrors, vIsRegisterValid = _a.vValid;
                    if (!vIsRegisterValid) {
                        throw new apollo_server_errors_1.UserInputError('Errors', { vErrors: vErrors });
                    }
                    return [4, config_2.bcryptHash(vRegisterInput.password, 99)];
                case 2:
                    vPassword = _b.sent();
                    if (!vPassword) {
                        throw new apollo_server_errors_1.AuthenticationError('Password is empty');
                    }
                    vNewUser = new User_1.User.UserSchema_Model({
                        email: vRegisterInput.email,
                        username: vRegisterInput.username,
                        userFullName: vRegisterInput.userFullName,
                        password: vPassword,
                        createdAt: new Date().toISOString(),
                    });
                    return [4, vNewUser.save()];
                case 3:
                    vNewUserCreated = _b.sent();
                    if (!vNewUserCreated) {
                        throw new apollo_server_errors_1.ApolloError("Internal Server error");
                    }
                    ;
                    vNewUserCreated.set({ vPassword: null });
                    return [2, { status: "successful" }];
                case 4:
                    err_3 = _b.sent();
                    console.log(err_3);
                    return [2, err_3];
                case 5: return [2];
            }
        });
    }); }
};
exports.users = {
    Mutation: Mutation,
    Query: Query
};
