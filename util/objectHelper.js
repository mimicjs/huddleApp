"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectHelper = void 0;
function hasOwnProperty(pObject, pProperty) {
    return pObject.hasOwnProperty(pProperty) || (pProperty in pObject);
}
;
var isNullOrEmpty = function (pObject) {
    return pObject === null || undefined
        ? true
        : (function () {
            for (var prop in pObject) {
                if (Object.prototype.hasOwnProperty.call(pObject, prop)) {
                    return false;
                }
            }
            return true;
        })();
};
function isObjectID(pString) {
    var vErrorMessage = 'Invalid ObjectID must be a single String of 12 bytes or a string of 24 hex characters';
    if (!pString) {
        return vErrorMessage;
    }
    ;
    pString = pString.toString();
    if (!(pString.match(/^[0-9a-fA-F]{24}$/))) {
        return vErrorMessage;
    }
    ;
    return null;
}
;
function isValidEmailAddress(pString) {
    var regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!pString.match(regEx)) {
        return 'Invalid email format';
    }
    ;
    return null;
}
;
function retrieveCookieValue(context, pCookieName) {
    if (!context || !context.req || !hasOwnProperty(context.req.headers, 'cookie')) {
        return null;
    }
    ;
    var vCookie = context.req.headers.cookie.split(';').find(function (cookie) { return cookie.includes(pCookieName); });
    if (isNullOrEmpty(vCookie)) {
        return null;
    }
    ;
    vCookie = vCookie.substr(pCookieName.length + 1);
    return vCookie;
}
exports.objectHelper = {
    hasOwnProperty: hasOwnProperty,
    isNullOrEmpty: isNullOrEmpty,
    isObjectID: isObjectID,
    isValidEmailAddress: isValidEmailAddress,
    retrieveCookieValue: retrieveCookieValue
};
