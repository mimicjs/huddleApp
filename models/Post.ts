/**************************************************************************
 * CREATOR: JACKY S
 * CREATED ON: May 2021
 * BACKLOG ITEM ID: <MVP_001>
 * DESCRIPTION: Post-related Database models - Mongoose <--> MongoDB
 * 
 * CHANGE HISTORY
 * =======================
 * DATE    BACKLOG ITEM   USER  DESCRIPTION 
 * 
**************************************************************************/

import { model as Imp_Mongoose_DocumentModel, Schema as Imp_Mongoose_Schema } from 'mongoose';

import { User as Imp_User } from './User';
import { objectHelper as Imp_Helper_objectHelper } from '../util/objectHelper';
import { ID as Imp_ID } from './ID';

interface IMessage {
    _id: any,
    parent: any,
    body: any,
    createdAt: any,
    comments: any,
    emotePreviews: any,
    user: any
}

//
//Back-end (Typescript). Post class
//
class PostClass implements IMessage {
    _id!: Imp_Mongoose_Schema.Types.ObjectId;
    parent: typeof Imp_ID | Imp_Mongoose_Schema.Types.ObjectId;
    createdAt!: string;
    body!: '';
    comments!: Imp_Mongoose_Schema.Types.ObjectId[];
    emotePreviews!: EmotePreview[];
    user!: typeof Imp_ID | Imp_Mongoose_Schema.Types.ObjectId;

    constructor(
        parent: typeof Imp_ID | Imp_Mongoose_Schema.Types.ObjectId,
        body: '',
        createdAt: string,
        comments: Imp_Mongoose_Schema.Types.ObjectId[],
        emotePreviews: EmotePreview[],
        user: typeof Imp_ID | Imp_Mongoose_Schema.Types.ObjectId
    ) {
        this.parent = parent;
        this.body = body;
        this.createdAt = createdAt;
        this.comments = comments;
        this.emotePreviews = emotePreviews;
        this.user = user;
    }
};

class CommentClass extends PostClass { };

class EmoteClass {
    _id!: typeof Imp_ID | Imp_Mongoose_Schema.Types.ObjectId;
    parent!: typeof Imp_ID | Imp_Mongoose_Schema.Types.ObjectId;
    emoticon!: '';
    createdAt!: string;
    user!: typeof Imp_ID | Imp_Mongoose_Schema.Types.ObjectId;

    constructor(
        parent: typeof Imp_ID | Imp_Mongoose_Schema.Types.ObjectId,
        emoticon: '',
        createdAt: string,
        user: typeof Imp_ID | Imp_Mongoose_Schema.Types.ObjectId
    ) {
        this.parent = parent;
        this.emoticon = emoticon;
        this.createdAt = createdAt;
        this.user = user;
    }
};

/*const EmoteID = {
    type!: Imp_Mongoose_Schema.Types.ObjectId,
    ref: 'Emote'
};*/

//Easier lookup for User-Emote uniqueness for the case:
//  Post/Comment when not provided a EmoteID in query it'll create a new Emote when there already exists one by User
class EmotePreview {
    emote!: typeof Imp_ID | Imp_Mongoose_Schema.Types.ObjectId;
    user!: typeof Imp_ID | Imp_Mongoose_Schema.Types.ObjectId;

    constructor(
        emote: typeof Imp_ID | Imp_Mongoose_Schema.Types.ObjectId,
        user: typeof Imp_ID | Imp_Mongoose_Schema.Types.ObjectId
    ) {
        this.emote = emote;
        this.user = user;
    }
};

//To help construct Mongoose Post model
const PostSchema: Imp_Mongoose_Schema = new Imp_Mongoose_Schema(
    new PostClass(Imp_ID, '', '', [], [], Imp_ID)
);
const CommentSchema: Imp_Mongoose_Schema = new Imp_Mongoose_Schema(
    new CommentClass(Imp_ID, '', '', [], [], Imp_ID)
);
const EmoteSchema: Imp_Mongoose_Schema = new Imp_Mongoose_Schema(
    new EmoteClass(Imp_ID, '', '', Imp_ID)
);

//Mongoose Schema static and instance methods
//
//postSchema.static('sayHappy', (param) => { console.log('found me') });
/* No longer required: Fixed up typeDefs schema to allow ID to contain ID details within Object type
   of which would get populated by mongoose .populate
PostSchema.static('populateWithUserFullName', (db_Obj: []): boolean => {
    //Populate. Post.user => userFullName and Post.comment.user => userFullName
    //FIXME: Optimisation required - 
    //FIXME: Iterates and Updates obj of all Posts & Comments FIXME:
    if (Imp_Helper_objectHelper.isNullOrEmpty(db_Obj)) {
        return false;
    }
    db_Obj.forEach((db_Obj: { [key: string]: any }) => {
        if (!(Imp_Helper_objectHelper.isNullOrEmpty(db_Obj.user))
        && Imp_Helper_objectHelper.hasOwnProperty(db_Obj.user, 'userFullName')) 
        {
            db_Obj["userFullName"] = db_Obj.user.userFullName;
        };
        db_post.comments.forEach((db_comment: { [key: string]: any }) => {
            if (!(Imp_Helper_objectHelper.isNullOrEmpty(db_comment.user))
                && Imp_Helper_objectHelper.hasOwnProperty(db_comment.user, 'userFullName')) {
                db_comment["userFullName"] = db_comment.user.userFullName;
            };
        });
    });
    return true;
});*/
/*PostSchema.method('populateusers', (pToken: string) => { 
    console.log('userSchema.method: param: ' + pToken); 
    console.log('userSchema.method: userSchema'); 
    console.log(userSchema); });*/

//
//Database connection interaction. Mongoose User model.
//
//Note: split into their own collections to reduce size of object necessary to be retrieved
//      if creating more database instances with same schema then search will depend on dateTime of object
const PostSchema_Model = Imp_Mongoose_DocumentModel('Post', PostSchema, 'posts');
//Decoupling of Post from Comments, and Emotes to control quantity of relevant data sent back to client
const CommentSchema_Model = Imp_Mongoose_DocumentModel('Comment', CommentSchema, 'comments');
const EmoteSchema_Model = Imp_Mongoose_DocumentModel('Emote', EmoteSchema, 'emotes');

export const Post = {
    PostClass: new PostClass(Imp_ID, '', '', [], [], Imp_ID),
    PostSchema_Model,
    CommentSchema_Model,
    EmoteSchema_Model,
    EmoteClass: new EmoteClass(Imp_ID, '', '', Imp_ID),
    EmotePreview: new EmotePreview(Imp_ID, Imp_ID)
};

