"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.comments = void 0;
var apollo_server_express_1 = require("apollo-server-express");
var Post_1 = require("../../models/Post");
var auth_1 = require("../../util/auth");
var objectHelper_1 = require("../../util/objectHelper");
var Mutation = {
    createComment: function (_, body, context) { return __awaiter(void 0, void 0, void 0, function () {
        var vPostID, vCommentID, vCommentBody, vUser_Authenticated, vParentID, vDBSchemaModel, vNewComment, vDB_Post, vDB_Comment, err_1;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 4, , 5]);
                    vPostID = (_a = body.postID) === null || _a === void 0 ? void 0 : _a.trim();
                    vCommentID = (_b = body.commentID) === null || _b === void 0 ? void 0 : _b.trim();
                    vCommentBody = (_c = body.commentBody) === null || _c === void 0 ? void 0 : _c.trim();
                    return [4, auth_1.auth.authChecker(context)];
                case 1:
                    vUser_Authenticated = _d.sent();
                    if (!vUser_Authenticated) {
                        throw new apollo_server_express_1.AuthenticationError('Unauthorised access');
                    }
                    ;
                    if (objectHelper_1.objectHelper.isNullOrEmpty(vCommentBody)) {
                        throw new apollo_server_express_1.UserInputError('Empty comment', {
                            errors: {
                                body: 'Enter a valid comment'
                            }
                        });
                    }
                    ;
                    if (objectHelper_1.objectHelper.isObjectID(vPostID) !== null) {
                        if (objectHelper_1.objectHelper.isObjectID(vCommentID) !== null) {
                            throw new apollo_server_express_1.UserInputError('Invalid vPostID and/or vCommentID', {
                                errors: {
                                    body: 'Enter a valid vPostID and/or vCommentID'
                                }
                            });
                        }
                    }
                    ;
                    vParentID = vPostID;
                    vDBSchemaModel = Post_1.Post.PostSchema_Model;
                    if (objectHelper_1.objectHelper.isObjectID(vCommentID) === null) {
                        vParentID = vCommentID;
                        vDBSchemaModel = Post_1.Post.CommentSchema_Model;
                    }
                    ;
                    vNewComment = new Post_1.Post.CommentSchema_Model({
                        parent: vParentID,
                        createdAt: new Date().toISOString(),
                        user: vUser_Authenticated._id,
                        body: vCommentBody
                    });
                    return [4, vDBSchemaModel.findByIdAndUpdate({ _id: vParentID }, { $push: { comments: vNewComment._id } }, {
                            new: true,
                            upsert: false,
                            rawResult: false,
                            useFindAndModify: false,
                            lean: true
                        })];
                case 2:
                    vDB_Post = _d.sent();
                    if (objectHelper_1.objectHelper.isNullOrEmpty(vDB_Post)) {
                        throw new apollo_server_express_1.UserInputError('Post or Comment not found');
                    }
                    ;
                    return [4, vNewComment.save()];
                case 3:
                    vDB_Comment = _d.sent();
                    if (objectHelper_1.objectHelper.isNullOrEmpty(vDB_Comment)) {
                        throw new apollo_server_express_1.ApolloError("Internal Server error");
                    }
                    console.log(vDB_Post);
                    return [2, { status: 'successful' }];
                case 4:
                    err_1 = _d.sent();
                    console.log(err_1);
                    return [2, { status: 'unsuccessful' }];
                case 5: return [2];
            }
        });
    }); }
};
exports.comments = {
    Mutation: Mutation
};
