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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.posts = void 0;
var apollo_server_errors_1 = require("apollo-server-errors");
var Post_1 = require("../../models/Post");
var auth_js_1 = require("../../util/auth.js");
var objectHelper_1 = require("../../util/objectHelper");
var validators_1 = require("../../util/validators");
var Query = {
    getPosts: function (_, body, context) { return __awaiter(void 0, void 0, void 0, function () {
        var vUser_Authenticated, vDBSchema, vDB_Posts, _a, _b, err_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 4, , 5]);
                    return [4, auth_js_1.auth.authChecker(context)];
                case 1:
                    vUser_Authenticated = _c.sent();
                    if (!vUser_Authenticated) {
                        throw 'Unauthorised access';
                    }
                    ;
                    vDBSchema = Post_1.Post.PostSchema_Model;
                    _b = (_a = Promise).all;
                    return [4, vDBSchema.find({}, {}, { lean: true })
                            .populate([
                            { path: 'user', model: 'User', select: 'userFullName username' },
                            { path: 'emotePreviews.emote', model: 'Emote' },
                            {
                                path: 'comments', model: 'Comment',
                                populate: [
                                    { path: 'user', model: 'User', select: 'userFullName username' },
                                    { path: 'emotePreviews.emote', model: 'Emote' }
                                ]
                            }
                        ])];
                case 2: return [4, _b.apply(_a, [[
                            _c.sent()
                        ]])];
                case 3:
                    vDB_Posts = _c.sent();
                    vDB_Posts = vDB_Posts[0];
                    return [2, vDB_Posts];
                case 4:
                    err_1 = _c.sent();
                    console.log(err_1);
                    return [2, { status: 'unsuccessful' }];
                case 5: return [2];
            }
        });
    }); },
    getPostOrComment: function (_, body, context) { return __awaiter(void 0, void 0, void 0, function () {
        var vUser_Authenticated, vPostID, vCommentID, vPostOrCommentID, DBSchemaModel, vErr_isObjectID_vPostOrCommentID, vDB_Post, _a, _b, err_2;
        var _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 4, , 5]);
                    return [4, auth_js_1.auth.authChecker(context)];
                case 1:
                    vUser_Authenticated = _e.sent();
                    if (!vUser_Authenticated) {
                        throw 'Unauthorised access';
                    }
                    ;
                    vPostID = (_c = body.postID) === null || _c === void 0 ? void 0 : _c.trim();
                    vCommentID = (_d = body.commentID) === null || _d === void 0 ? void 0 : _d.trim();
                    vPostOrCommentID = vPostID;
                    DBSchemaModel = Post_1.Post.PostSchema_Model;
                    if (vCommentID) {
                        vPostOrCommentID = vCommentID;
                        DBSchemaModel = Post_1.Post.CommentSchema_Model;
                    }
                    ;
                    vErr_isObjectID_vPostOrCommentID = objectHelper_1.objectHelper.isObjectID(vPostOrCommentID);
                    if (vErr_isObjectID_vPostOrCommentID != null) {
                        throw new apollo_server_errors_1.ApolloError(vErr_isObjectID_vPostOrCommentID, 'INTERNAL_SERVER_ERROR');
                    }
                    ;
                    _b = (_a = Promise).all;
                    return [4, DBSchemaModel.findById(vPostOrCommentID, {}, { lean: true })
                            .populate([
                            { path: 'user', model: 'User', select: 'userFullName username' },
                            { path: 'emotePreviews.emote', model: 'Emote' },
                            {
                                path: 'comments', model: 'Comment',
                                populate: [
                                    { path: 'user', model: 'User', select: 'userFullName username' },
                                    { path: 'emotePreviews.emote', model: 'Emote' }
                                ]
                            }
                        ])];
                case 2: return [4, _b.apply(_a, [[
                            _e.sent()
                        ]])];
                case 3:
                    vDB_Post = _e.sent();
                    vDB_Post = vDB_Post[0];
                    return [2, vDB_Post];
                case 4:
                    err_2 = _e.sent();
                    console.log(err_2);
                    return [2, { status: 'unsuccessful' }];
                case 5: return [2];
            }
        });
    }); }
};
var Mutation = {
    createPost: function (_, body, context) { return __awaiter(void 0, void 0, void 0, function () {
        var vUser_Authenticated, vParentID, vBody, vNewPost, vDB_Post, err_3;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 3, , 4]);
                    return [4, auth_js_1.auth.authChecker(context)];
                case 1:
                    vUser_Authenticated = _c.sent();
                    if (!vUser_Authenticated) {
                        throw 'Unauthorised access';
                    }
                    ;
                    vParentID = (_a = body.parentID) === null || _a === void 0 ? void 0 : _a.trim();
                    vBody = (_b = body.body) === null || _b === void 0 ? void 0 : _b.trim();
                    if (objectHelper_1.objectHelper.isNullOrEmpty(vBody)) {
                        throw ("Internal Server error");
                    }
                    vNewPost = new Post_1.Post.PostSchema_Model({
                        body: vBody,
                        createdAt: new Date().toISOString(),
                        user: vUser_Authenticated._id
                    });
                    if (objectHelper_1.objectHelper.isObjectID(vParentID) === null) {
                        vNewPost.set({ parent: vParentID });
                    }
                    ;
                    return [4, vNewPost.save()];
                case 2:
                    vDB_Post = _c.sent();
                    if (objectHelper_1.objectHelper.isNullOrEmpty(vDB_Post)) {
                        throw ("Internal Server error");
                    }
                    return [2, { status: 'successful' }];
                case 3:
                    err_3 = _c.sent();
                    console.log(err_3);
                    return [2, { status: 'unsuccessful' }];
                case 4: return [2];
            }
        });
    }); },
    createPostGuest: function (_, body, context) { return __awaiter(void 0, void 0, void 0, function () {
        var vParentID, vBody, vNewPost, vDB_Post, err_4;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    vParentID = (_a = body.parentID) === null || _a === void 0 ? void 0 : _a.trim();
                    vBody = (_b = body.body) === null || _b === void 0 ? void 0 : _b.trim();
                    if (objectHelper_1.objectHelper.isNullOrEmpty(vBody)) {
                        throw ("Internal Server error");
                    }
                    vNewPost = new Post_1.Post.PostSchema_Model({
                        body: vBody,
                        createdAt: new Date().toISOString(),
                    });
                    if (objectHelper_1.objectHelper.isObjectID(vParentID) === null) {
                        vNewPost.set({ parent: vParentID });
                    }
                    ;
                    return [4, vNewPost.save()];
                case 1:
                    vDB_Post = _c.sent();
                    if (objectHelper_1.objectHelper.isNullOrEmpty(vDB_Post)) {
                        throw ("Internal Server error");
                    }
                    return [2, { status: 'successful' }];
                case 2:
                    err_4 = _c.sent();
                    console.log(err_4);
                    return [2, { status: 'unsuccessful' }];
                case 3: return [2];
            }
        });
    }); },
    emotePostOrComment: function (_, body, context) { return __awaiter(void 0, void 0, void 0, function () {
        var vUser_Authenticated, vPostID, vCommentID, vEmoteID, vEmoticon, vPostOrCommentID, vDBSchemaModel, vValid, vEmoticon_Verified, vDB_Emote_Existing_1, vDB_PostOrCommentID, vDB_newEmote_1, vDB_Emote_Existing, vNewEmote, vNewEmotePreview, vDB_post, vDB_newEmote, err_5;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 14, , 15]);
                    return [4, auth_js_1.auth.authChecker(context)];
                case 1:
                    vUser_Authenticated = _e.sent();
                    if (!vUser_Authenticated) {
                        throw 'Unauthorised access';
                    }
                    ;
                    vPostID = (_a = body.postID) === null || _a === void 0 ? void 0 : _a.trim();
                    vCommentID = (_b = body.commentID) === null || _b === void 0 ? void 0 : _b.trim();
                    ;
                    vEmoteID = (_c = body.emoteID) === null || _c === void 0 ? void 0 : _c.trim();
                    ;
                    vEmoticon = (_d = body.emoticon) === null || _d === void 0 ? void 0 : _d.trim();
                    ;
                    vPostOrCommentID = vPostID;
                    vDBSchemaModel = Post_1.Post.PostSchema_Model;
                    if (objectHelper_1.objectHelper.isObjectID(vCommentID) === null) {
                        vPostOrCommentID = vCommentID;
                        vDBSchemaModel = Post_1.Post.CommentSchema_Model;
                    }
                    ;
                    if (objectHelper_1.objectHelper.isObjectID(vPostOrCommentID) !== null) {
                        console.log('Invalid postID or commentID');
                        throw 'Invalid postID or commentID';
                    }
                    ;
                    return [4, validators_1.validators.validateEmotePostOrComment(vEmoticon)];
                case 2:
                    vValid = (_e.sent()).vValid;
                    if (!(vValid)) {
                        console.log('Invalid emoticon');
                        throw 'Invalid emoticon';
                    }
                    ;
                    vEmoticon_Verified = vEmoticon;
                    if (!!(objectHelper_1.objectHelper.isNullOrEmpty(vEmoteID))) return [3, 10];
                    console.log(">>> !(Imp_Helper_objectHelper.isNullOrEmpty(vEmoteID))");
                    return [4, Post_1.Post.EmoteSchema_Model.findById(vEmoteID)];
                case 3:
                    vDB_Emote_Existing_1 = _e.sent();
                    if (!!(objectHelper_1.objectHelper.isNullOrEmpty(vDB_Emote_Existing_1))) return [3, 9];
                    console.log('>>> vPostOrCommentID: >>>');
                    console.log(vPostOrCommentID);
                    console.log(">>> !(Imp_Helper_objectHelper.isNullOrEmpty(vDB_Emote_Existing))");
                    console.log(vDB_Emote_Existing_1);
                    if (!(vDB_Emote_Existing_1.parent != vPostOrCommentID)) return [3, 4];
                    throw new apollo_server_errors_1.AuthenticationError("Emote not saved, Post or Comment does not match Emote's Parent");
                case 4:
                    if (!(vDB_Emote_Existing_1.user != vUser_Authenticated._id)) return [3, 5];
                    throw new apollo_server_errors_1.AuthenticationError('Emote not saved, User mismatch or already emote');
                case 5:
                    if (!(vDB_Emote_Existing_1.emoticon === vEmoticon_Verified)) return [3, 7];
                    console.log(">>> else if (vDB_Emote_Existing.emoticon === vEmoticon_Verified)");
                    return [4, vDBSchemaModel.findByIdAndUpdate({ _id: vPostOrCommentID }, { $pull: { emotePreviews: { emote: vDB_Emote_Existing_1._id } } }, {
                            new: true,
                            upsert: false,
                            rawResult: false,
                            useFindAndModify: false
                        })];
                case 6:
                    vDB_PostOrCommentID = _e.sent();
                    if (objectHelper_1.objectHelper.isNullOrEmpty(vDB_PostOrCommentID)) {
                        throw new apollo_server_errors_1.UserInputError('Post not found');
                    }
                    vDB_Emote_Existing_1.delete();
                    return [2, { status: 'successful' }];
                case 7:
                    ;
                    console.log("//Flow: Update existing Emote");
                    return [4, Post_1.Post.EmoteSchema_Model.findByIdAndUpdate({ _id: vDB_Emote_Existing_1._id }, { emoticon: vEmoticon_Verified }, {
                            new: true,
                            upsert: true,
                            rawResult: false,
                            useFindAndModify: false
                        })];
                case 8:
                    vDB_newEmote_1 = _e.sent();
                    if (!vDB_newEmote_1) {
                        throw new apollo_server_errors_1.UserInputError('Emote not saved');
                    }
                    ;
                    return [2, {
                            status: 'successful',
                            emote: vDB_newEmote_1
                        }];
                case 9: throw new apollo_server_errors_1.UserInputError('Invalid EmoteID');
                case 10: return [4, vDBSchemaModel.findOne({
                        _id: vPostOrCommentID,
                        "emotePreviews.user": vUser_Authenticated._id
                    })];
                case 11:
                    vDB_Emote_Existing = _e.sent();
                    if (!(objectHelper_1.objectHelper.isNullOrEmpty(vDB_Emote_Existing))) {
                        throw new apollo_server_errors_1.AuthenticationError(vDB_Emote_Existing + '\nEmote not created, User already has a EmotePreview for this Post or Comment');
                    }
                    ;
                    vNewEmote = new Post_1.Post.EmoteSchema_Model({
                        parent: vPostOrCommentID,
                        createdAt: new Date().toISOString(),
                        emoticon: vEmoticon_Verified,
                        user: vUser_Authenticated._id
                    });
                    vNewEmotePreview = Post_1.Post.EmotePreview;
                    vNewEmotePreview.emote = vNewEmote._id;
                    vNewEmotePreview.user = vUser_Authenticated._id;
                    return [4, vDBSchemaModel.findByIdAndUpdate({ _id: vPostOrCommentID }, { $push: { emotePreviews: vNewEmotePreview } }, {
                            new: true,
                            upsert: false,
                            rawResult: false,
                            useFindAndModify: false
                        })];
                case 12:
                    vDB_post = _e.sent();
                    if (objectHelper_1.objectHelper.isNullOrEmpty(vDB_post)) {
                        throw 'Post was not updated with new EmoteID';
                    }
                    ;
                    vDB_newEmote = null;
                    return [4, vNewEmote.save()];
                case 13:
                    vDB_newEmote = _e.sent();
                    if (objectHelper_1.objectHelper.isNullOrEmpty(vDB_newEmote)) {
                        throw new apollo_server_errors_1.UserInputError('Emote not saved');
                    }
                    ;
                    return [2, { status: 'successful' }];
                case 14:
                    err_5 = _e.sent();
                    console.log(err_5);
                    return [2, { status: 'unsuccessful' }];
                case 15: return [2];
            }
        });
    }); },
    deletePostOrComment: function (_, body, context) { return __awaiter(void 0, void 0, void 0, function () {
        var vUser_Authenticated, vPostID, vCommentID, vPostOrCommentID_ToDelete, vDBSchemaModel_ToDeleteFrom, vDB_PostOrComment_To_Delete, vDB_Post, vDB_PostOrComment_To_Delete_with_CommentsHierarchy, vEmotesArray_To_Delete, vDB_SchemaModel_Parent_ToUpdate, vEmotes_Deleted_Response, vComments_Deleted_Response, err_6;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 10, , 11]);
                    return [4, auth_js_1.auth.authChecker(context)];
                case 1:
                    vUser_Authenticated = _c.sent();
                    if (!vUser_Authenticated) {
                        throw 'Unauthorised access';
                    }
                    ;
                    vPostID = (_a = body.postID) === null || _a === void 0 ? void 0 : _a.trim();
                    vCommentID = (_b = body.commentID) === null || _b === void 0 ? void 0 : _b.trim();
                    vPostOrCommentID_ToDelete = vPostID;
                    vDBSchemaModel_ToDeleteFrom = Post_1.Post.PostSchema_Model;
                    if (objectHelper_1.objectHelper.isObjectID(vCommentID) === null) {
                        vPostOrCommentID_ToDelete = vCommentID;
                        vDBSchemaModel_ToDeleteFrom = Post_1.Post.CommentSchema_Model;
                    }
                    ;
                    vPostOrCommentID_ToDelete = vPostOrCommentID_ToDelete === null || vPostOrCommentID_ToDelete === void 0 ? void 0 : vPostOrCommentID_ToDelete.trim();
                    if (objectHelper_1.objectHelper.isObjectID(vPostOrCommentID_ToDelete) != null) {
                        throw 'Invalid postID';
                    }
                    ;
                    vDB_PostOrComment_To_Delete = null;
                    vDB_Post = null;
                    return [4, vDBSchemaModel_ToDeleteFrom.findById(vPostOrCommentID_ToDelete)];
                case 2:
                    vDB_PostOrComment_To_Delete = _c.sent();
                    if (objectHelper_1.objectHelper.isNullOrEmpty(vDB_PostOrComment_To_Delete)) {
                        throw 'Post or Comment not found';
                    }
                    ;
                    if (vUser_Authenticated._id != vDB_PostOrComment_To_Delete.user) {
                        throw 'Unauthorized action - Post creator required';
                    }
                    ;
                    return [4, vDBSchemaModel_ToDeleteFrom.aggregate([
                            { $match: { _id: vDB_PostOrComment_To_Delete._id } }
                        ]).graphLookup({
                            from: 'comments', startWith: '$_id',
                            connectFromField: '_id', connectToField: 'parent',
                            as: 'commentsHierarchy', maxDepth: 1000
                        })];
                case 3:
                    vDB_PostOrComment_To_Delete_with_CommentsHierarchy = _c.sent();
                    vEmotesArray_To_Delete = vDB_PostOrComment_To_Delete_with_CommentsHierarchy[0]
                        .commentsHierarchy.map(function (comment) { return (comment.emotePreviews.map(function (emotePreview) { return (emotePreview.emote); })); });
                    vEmotesArray_To_Delete = vEmotesArray_To_Delete.flat();
                    if (!(objectHelper_1.objectHelper.isObjectID(vDB_PostOrComment_To_Delete.parent) == null)) return [3, 5];
                    console.log('\n executing findByIdAndUpdate');
                    vDB_SchemaModel_Parent_ToUpdate = Post_1.Post.PostSchema_Model;
                    if (vPostID != vDB_PostOrComment_To_Delete.parent) {
                        vDB_SchemaModel_Parent_ToUpdate = Post_1.Post.CommentSchema_Model;
                    }
                    ;
                    return [4, vDB_SchemaModel_Parent_ToUpdate.findByIdAndUpdate({ _id: vDB_PostOrComment_To_Delete.parent }, { $pull: { comments: vDB_PostOrComment_To_Delete._id } }, { useFindAndModify: false }, function (error, response) {
                            console.log("***error on findByIdAndUpdate");
                            console.log(!objectHelper_1.objectHelper.isNullOrEmpty(error));
                            console.log("***response on findByIdAndUpdate");
                            console.log(!objectHelper_1.objectHelper.isNullOrEmpty(response));
                        })];
                case 4:
                    _c.sent();
                    return [3, 6];
                case 5:
                    console.log("***vDB_PostOrComment_To_Delete.parent) === null >>> only for parent of type Post because Posts don't have Parents for now");
                    console.log(objectHelper_1.objectHelper.isObjectID(vDB_PostOrComment_To_Delete.parent));
                    _c.label = 6;
                case 6:
                    ;
                    console.log('\n ***executing EmoteSchema_Model.deleteMany');
                    return [4, Post_1.Post.EmoteSchema_Model.deleteMany({
                            _id: {
                                $in: __spreadArray(__spreadArray([], vDB_PostOrComment_To_Delete_with_CommentsHierarchy[0].emotePreviews.map(function (emotePreview) { return (emotePreview.emote); })), vEmotesArray_To_Delete),
                            }
                        })];
                case 7:
                    vEmotes_Deleted_Response = _c.sent();
                    console.log("***response on deleteMany (EmoteSchema_Model responseObj): ");
                    console.log('disabledComment>>> vEmotes_Deleted_Response');
                    console.log('\n ***executing CommentSchema_Model.deleteMany');
                    return [4, Post_1.Post.CommentSchema_Model.deleteMany({
                            _id: {
                                $in: __spreadArray([], vDB_PostOrComment_To_Delete_with_CommentsHierarchy[0].commentsHierarchy.map(function (comment) { return (comment._id); })),
                            }
                        })];
                case 8:
                    vComments_Deleted_Response = _c.sent();
                    console.log("***response on deleteMany (CommentSchema_Model responseObj): ");
                    console.log('disabledComment>>> vComments_Deleted_Response');
                    console.log('\n ***executing vDB_PostOrComment_To_Delete.remove');
                    return [4, vDB_PostOrComment_To_Delete.remove()];
                case 9:
                    _c.sent();
                    return [2, { status: 'successful' }];
                case 10:
                    err_6 = _c.sent();
                    console.log(err_6);
                    return [2, { status: 'unsuccessful' }];
                case 11: return [2];
            }
        });
    }); }
};
var Subscription = {
    newPost: {
        subscribe: function (_, __, context) {
            return context.pubsub.asyncIterator('NEW_POST');
        }
    }
};
exports.posts = {
    Query: Query,
    Mutation: Mutation,
    Subscription: Subscription
};
