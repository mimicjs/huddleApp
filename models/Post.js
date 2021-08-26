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
exports.Post = void 0;
var mongoose_1 = require("mongoose");
var ID_1 = require("./ID");
var PostClass = (function () {
    function PostClass(parent, body, createdAt, comments, emotePreviews, user) {
        this.parent = parent;
        this.body = body;
        this.createdAt = createdAt;
        this.comments = comments;
        this.emotePreviews = emotePreviews;
        this.user = user;
    }
    return PostClass;
}());
;
var CommentClass = (function (_super) {
    __extends(CommentClass, _super);
    function CommentClass() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CommentClass;
}(PostClass));
;
var EmoteClass = (function () {
    function EmoteClass(parent, emoticon, createdAt, user) {
        this.parent = parent;
        this.emoticon = emoticon;
        this.createdAt = createdAt;
        this.user = user;
    }
    return EmoteClass;
}());
;
var EmotePreview = (function () {
    function EmotePreview(emote, user) {
        this.emote = emote;
        this.user = user;
    }
    return EmotePreview;
}());
;
var PostSchema = new mongoose_1.Schema(new PostClass(ID_1.ID, '', '', [], [], ID_1.ID));
var CommentSchema = new mongoose_1.Schema(new CommentClass(ID_1.ID, '', '', [], [], ID_1.ID));
var EmoteSchema = new mongoose_1.Schema(new EmoteClass(ID_1.ID, '', '', ID_1.ID));
var PostSchema_Model = mongoose_1.model('Post', PostSchema, 'posts');
var CommentSchema_Model = mongoose_1.model('Comment', CommentSchema, 'comments');
var EmoteSchema_Model = mongoose_1.model('Emote', EmoteSchema, 'emotes');
exports.Post = {
    PostClass: new PostClass(ID_1.ID, '', '', [], [], ID_1.ID),
    PostSchema_Model: PostSchema_Model,
    CommentSchema_Model: CommentSchema_Model,
    EmoteSchema_Model: EmoteSchema_Model,
    EmoteClass: new EmoteClass(ID_1.ID, '', '', ID_1.ID),
    EmotePreview: new EmotePreview(ID_1.ID, ID_1.ID)
};
