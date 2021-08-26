"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.index = void 0;
var posts_1 = require("./posts");
var comments_1 = require("./comments");
var users_1 = require("./users");
var objectHelper_1 = require("../../util/objectHelper");
var shared_CommentPost_resolvers = {
    commentsCount: function (parent) {
        try {
            if (objectHelper_1.objectHelper.hasOwnProperty(parent, 'comments')) {
                return parent.comments.length;
            }
        }
        catch (err) {
            console.log(err);
        }
    },
    emotePreviewsCount: function (parent) {
        try {
            if (objectHelper_1.objectHelper.hasOwnProperty(parent, 'emotePreviews')) {
                return parent.emotePreviews.length;
            }
        }
        catch (err) {
            console.log(err);
        }
    }
};
var resolvers = {
    Query: __assign(__assign({}, posts_1.posts.Query), users_1.users.Query),
    Mutation: __assign(__assign(__assign({}, posts_1.posts.Mutation), comments_1.comments.Mutation), users_1.users.Mutation),
    Subscription: __assign({}, posts_1.posts.Subscription),
    Post: __assign({}, shared_CommentPost_resolvers),
    Comment: __assign({}, shared_CommentPost_resolvers),
    IMessage: { __resolveType: function () { return null; } },
    IUser: { __resolveType: function () { return null; } },
};
exports.index = {
    resolvers: resolvers
};
