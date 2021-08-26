"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var mongoose_1 = require("mongoose");
;
var UserClass = (function () {
    function UserClass(createdAt, username, userFullName, password, email, refreshToken) {
        this.createdAt = createdAt;
        this.username = username;
        this.userFullName = userFullName;
        this.password = password;
        this.email = email;
        this.refreshToken = refreshToken;
    }
    return UserClass;
}());
;
var RegisterUserClass = (function (_super) {
    __extends(RegisterUserClass, _super);
    function RegisterUserClass() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return RegisterUserClass;
}(UserClass));
;
var UserSchema = new mongoose_1.Schema(new UserClass('', '', '', '', '', ''));
var UserSchema_Model = mongoose_1.model('User', UserSchema, 'users');
exports.User = {
    RegisterUserClass: new RegisterUserClass('', '', '', '', '', ''),
    UserClass: new UserClass('', '', '', '', '', ''),
    UserSchema_Model: UserSchema_Model
};
