"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var cookie_1 = __importDefault(require("cookie"));
var http_cookies_headers = {
    requestDidStart: function () {
        return {
            willSendResponse: function (requestContext) {
                var _a = requestContext.context, _b = _a.setHeaders, setHeaders = _b === void 0 ? [] : _b, _c = _a.setCookies, setCookies = _c === void 0 ? [] : _c;
                if (!Array.isArray(requestContext.context.setHeaders)) {
                    console.warn("setHeaders is not in context or is not an array");
                }
                if (!Array.isArray(requestContext.context.setCookies)) {
                    console.warn("setCookies is not in context or is not an array");
                }
                if (setCookies.length > 1) {
                    throw new Error("multiple cookies in setCookies provided but because of limitations in apollo-server only one cookie can be set");
                }
                setHeaders.forEach(function (_a) {
                    var key = _a.key, value = _a.value;
                    requestContext.response.http.headers.append(key, value);
                });
                setCookies.forEach(function (_a) {
                    var name = _a.name, value = _a.value, options = _a.options;
                    var cookieString = cookie_1.default.serialize(name, value, options);
                    requestContext.response.http.headers.set("Set-Cookie", cookieString);
                });
                return requestContext;
            }
        };
    }
};
module.exports = {
    http_cookies_headers: http_cookies_headers
};
