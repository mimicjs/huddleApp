/**************************************************************************
 * CREATOR: JACKY S
 * CREATED ON: May 2021
 * BACKLOG ITEM ID: <MVP_001>
 * DESCRIPTION: Resolver for Post-related queries
 * 
 * CHANGE HISTORY
 * =======================
 * DATE    BACKLOG ITEM   USER  DESCRIPTION 
 * 
**************************************************************************/

import { ApolloError as Imp_ApolloError, UserInputError as Imp_UserInputError, AuthenticationError as Imp_AuthenticationError, ApolloError } from 'apollo-server-errors';

import { Post as Imp_Post } from '../../models/Post';
import { auth as Imp_auth } from '../../util/auth.js';
import { objectHelper as Imp_Helper_objectHelper } from '../../util/objectHelper';
import { validators as Imp_Validators } from '../../util/validators';

const Query = {
    getPosts: async (_: string | null, body: {}, context: { [key: string]: any }): Promise<any> => {
        try {
            const vUser_Authenticated = await Imp_auth.authChecker(context);
            if (!vUser_Authenticated) {
                throw 'Unauthorised access';
            };
            const vDBSchema = Imp_Post.PostSchema_Model;
            let vDB_Posts = await Promise.all([
                await vDBSchema.find({}, {}, { lean: true })
                    //FIXME: Apparently .aggregate over .populate if you have to
                    //FIXME: https://itnext.io/performance-tips-for-mongodb-mongoose-190732a5d382 FIXME:
                    .populate([
                        { path: 'user', model: 'User', select: 'userFullName username' },
                        { path: 'emotePreviews.emote', model: 'Emote' },
                        {
                            path: 'comments', model: 'Comment',
                            populate: [
                                { path: 'user', model: 'User', select: 'userFullName username' },
                                { path: 'emotePreviews.emote', model: 'Emote' }
                            ]
                        }]
                    )
            ]);
            vDB_Posts = vDB_Posts[0];
            //TODO: FIXME: .sort({ createdAt: -1 }); //Sort comments descending by createdTime or let client do this?
            return vDB_Posts;
        } catch (err) {
            console.log(err);
            return { status: 'unsuccessful' };
        }
    },

    getPostOrComment: async (_: string | null, body: { postID: string | null, commentID: string | null }, context: { [key: string]: any }): Promise<any> => {
        try {
            const vUser_Authenticated = await Imp_auth.authChecker(context);
            if (!vUser_Authenticated) {
                throw 'Unauthorised access';
            };
            const vPostID = body.postID?.trim();
            const vCommentID = body.commentID?.trim();
            let vPostOrCommentID = vPostID;
            let DBSchemaModel = Imp_Post.PostSchema_Model;
            if (vCommentID) {
                vPostOrCommentID = vCommentID;
                DBSchemaModel = Imp_Post.CommentSchema_Model;
            };
            const vErr_isObjectID_vPostOrCommentID = Imp_Helper_objectHelper.isObjectID(vPostOrCommentID);
            if (vErr_isObjectID_vPostOrCommentID != null) {
                //TODO: FIXME: Return type for Resolver is not string therefore throwing error but not exception case..
                throw new ApolloError(vErr_isObjectID_vPostOrCommentID, 'INTERNAL_SERVER_ERROR');
            };
            let vDB_Post = await Promise.all([
                await DBSchemaModel.findById(vPostOrCommentID, {}, { lean: true })
                    //FIXME: Apparently .aggregate over .populate if you have to
                    //FIXME: https://itnext.io/performance-tips-for-mongodb-mongoose-190732a5d382
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
                    ]) //FIXME: Left-Join therefore if Obj of ID can't be found then ID becomes null
            ]);        //https://mongoosejs.com/docs/populate.html#doc-not-found 
            vDB_Post = vDB_Post[0]; //FIXME: I do want it to be logged for technical support to look into or have it deleted
            return vDB_Post;
        } catch (err) {
            console.log(err);
            return { status: 'unsuccessful' }
        }
    }
};

const Mutation = {
    createPost: async (_: string, body: { parentID: string | null, body: string | null }, context: { [key: string]: any }): Promise<any> => {
        try {
            const vUser_Authenticated = await Imp_auth.authChecker(context);
            if (!vUser_Authenticated) {
                throw 'Unauthorised access';
            };
            const vParentID = body.parentID?.trim();
            const vBody = body.body?.trim();
            if (Imp_Helper_objectHelper.isNullOrEmpty(vBody)) {
                throw ("Internal Server error");
            }
            const vNewPost = new Imp_Post.PostSchema_Model({
                body: vBody,
                createdAt: new Date().toISOString(),
                user: vUser_Authenticated._id
            });
            if (Imp_Helper_objectHelper.isObjectID(vParentID) === null) {
                vNewPost.set({ parent: vParentID });
            };
            //TODO: Parent of this post - Feed?: Profile?, Wall?, Page?, Post?, Market item?
            const vDB_Post = await vNewPost.save();
                /*Not required 23/08: .then((post: any) => post.populate("userID").execPopulate());*/
            if (Imp_Helper_objectHelper.isNullOrEmpty(vDB_Post)) {
                throw ("Internal Server error");
            }
            //TODO: context.pubsub.publish('NEW_POST', { newPost: vDB_Post });
            return { status: 'successful' }
        } catch (err) {
            console.log(err);
            return { status: 'unsuccessful' }
        }
    },
    createPostGuest: async (_: string, body: { parentID: string | null, body: string | null }, context: { [key: string]: any }): Promise<any> => {
        try {
            const vParentID = body.parentID?.trim();
            const vBody = body.body?.trim();
            if (Imp_Helper_objectHelper.isNullOrEmpty(vBody)) {
                throw ("Internal Server error");
            }
            const vNewPost = new Imp_Post.PostSchema_Model({
                body: vBody,
                createdAt: new Date().toISOString(),
            });
            if (Imp_Helper_objectHelper.isObjectID(vParentID) === null) {
                vNewPost.set({ parent: vParentID });
            };
            const vDB_Post = await vNewPost.save();
            if (Imp_Helper_objectHelper.isNullOrEmpty(vDB_Post)) {
                throw ("Internal Server error");
            }
            return { status: 'successful' }
        } catch (err) {
            console.log(err);
            return { status: 'unsuccessful' }
        }
    },

    emotePostOrComment: async (_: string | null, body: { postID: string | null, commentID: string | null, emoteID: string | null, emoticon: string | null }, context: { [key: string]: any }): Promise<any> => {
        try {
            const vUser_Authenticated = await Imp_auth.authChecker(context);
            if (!vUser_Authenticated) {
                throw 'Unauthorised access';
            };

            const vPostID = body.postID?.trim();
            const vCommentID = body.commentID?.trim();;
            const vEmoteID = body.emoteID?.trim();;
            const vEmoticon = body.emoticon?.trim();;

            //Identify which Post or Comment to add/update the Emote to 
            let vPostOrCommentID = vPostID;
            let vDBSchemaModel = Imp_Post.PostSchema_Model;
            if (Imp_Helper_objectHelper.isObjectID(vCommentID) === null) {
                vPostOrCommentID = vCommentID;
                vDBSchemaModel = Imp_Post.CommentSchema_Model;
            };
            if (Imp_Helper_objectHelper.isObjectID(vPostOrCommentID) !== null) {
                console.log('Invalid postID or commentID');
                throw 'Invalid postID or commentID';
            };

            //Emoticon list validation
            const { vValid } = await Imp_Validators.validateEmotePostOrComment(vEmoticon);
            if (!(vValid)) {
                console.log('Invalid emoticon');
                throw 'Invalid emoticon'
            };
            const vEmoticon_Verified = vEmoticon;
            //Flow (branch): Existing Emote by User
            if (!(Imp_Helper_objectHelper.isNullOrEmpty(vEmoteID))) {
                console.log(">>> !(Imp_Helper_objectHelper.isNullOrEmpty(vEmoteID))");
                //Diff. emoticon => Update Emote emoticon
                //Same emoticon => Delete Emote, and Emote reference (as EmotePreview)
                const vDB_Emote_Existing = await Imp_Post.EmoteSchema_Model.findById(vEmoteID); //Fetch to check if authorized user
                if (!(Imp_Helper_objectHelper.isNullOrEmpty(vDB_Emote_Existing))) {
                    console.log('>>> vPostOrCommentID: >>>')
                    console.log(vPostOrCommentID)
                    console.log(">>> !(Imp_Helper_objectHelper.isNullOrEmpty(vDB_Emote_Existing))");
                    console.log(vDB_Emote_Existing);
                    if (vDB_Emote_Existing.parent != vPostOrCommentID) { //intentional != and not !== due to different type comparisons
                        throw new Imp_AuthenticationError("Emote not saved, Post or Comment does not match Emote's Parent");
                    }
                    else if (vDB_Emote_Existing.user != vUser_Authenticated._id) { //intentional != and not !== due to different type comparisons
                        throw new Imp_AuthenticationError('Emote not saved, User mismatch or already emote');
                    } else if (vDB_Emote_Existing.emoticon === vEmoticon_Verified) {
                        console.log(">>> else if (vDB_Emote_Existing.emoticon === vEmoticon_Verified)");
                        const vDB_PostOrCommentID = await vDBSchemaModel.findByIdAndUpdate( //Remove existing Emote
                            { _id: vPostOrCommentID },
                            { $pull: { emotePreviews: { emote: vDB_Emote_Existing._id } } },
                            {
                                new: true, //Return back to us the Updated Post with pulled emote
                                upsert: false, //do not insert Document as PostSchema_Model if found none
                                rawResult: false,
                                useFindAndModify: false //true is deprecated node:21996 2021-05-12
                            },
                        );
                        if (Imp_Helper_objectHelper.isNullOrEmpty(vDB_PostOrCommentID)) {
                            throw new Imp_UserInputError('Post not found');
                        }
                        vDB_Emote_Existing.delete(); //Delete Emote only after Post or Comment has removed this Emote's ID in EmotePreview
                        return { status: 'successful' }; //End flow - Liking an existing emote with the same emoticon
                    };
                    //Flow: Update existing Emote to another Emoticon
                    console.log("//Flow: Update existing Emote");
                    let vDB_newEmote = await Imp_Post.EmoteSchema_Model.findByIdAndUpdate(
                        { _id: vDB_Emote_Existing._id },
                        { emoticon: vEmoticon_Verified },
                        {
                            new: true, //Return back to us the Updated Post with updated emoticon
                            upsert: true, //update and insert Document
                            rawResult: false,
                            useFindAndModify: false //true is deprecated node:21996 2021-05-12
                        },
                        //Callback introduces a duplicate newComments when we want only one
                    );
                    if (!vDB_newEmote) {
                        throw new Imp_UserInputError('Emote not saved');
                    };
                    return { 
                        status: 'successful',
                        emote: vDB_newEmote 
                    }; //End flow: Updated existing emote with new emoticon
                } else {
                    throw new Imp_UserInputError('Invalid EmoteID');
                }
            }
            //Flow: Create new Emote for Post by User
            //Check if User has a Emote already on this Post or Comment (for some reason query did not include EmoteID)
            const vDB_Emote_Existing = await vDBSchemaModel.findOne(
                {
                    _id: vPostOrCommentID,
                    "emotePreviews.user": vUser_Authenticated._id
                },
            );
            if (!(Imp_Helper_objectHelper.isNullOrEmpty(vDB_Emote_Existing))) { //Mismatch in Client's pov: User wanted to Emote but had already Emote before
                throw new Imp_AuthenticationError(vDB_Emote_Existing + '\nEmote not created, User already has a EmotePreview for this Post or Comment');
            };
            const vNewEmote = new Imp_Post.EmoteSchema_Model({
                parent: vPostOrCommentID,
                createdAt: new Date().toISOString(), //standard format to use. ISO > (UTC & GMT).
                emoticon: vEmoticon_Verified, //string.trimRight() is an alias of string.trimEnd()
                user: vUser_Authenticated._id //one-to-one relationship between User and Emote (on Post or Comment)
            });
            const vNewEmotePreview = Imp_Post.EmotePreview;
            vNewEmotePreview.emote = vNewEmote._id;
            vNewEmotePreview.user = vUser_Authenticated._id;
            //Update Post/Comment with EmoteID
            const vDB_post = await vDBSchemaModel.findByIdAndUpdate( //Update Post or Comment with new EmotePreview
                { _id: vPostOrCommentID }, //@ts-ignore //Ignore next line, typescript can't identify
                { $push: { emotePreviews: vNewEmotePreview } }, //$addToSet can't be applied to non-array field. Field named '_id' has non-array type objectId
                {
                    new: true, //Return back to us the Updated Post/Comment with newEmotePreview
                    upsert: false, //do not insert Document as PostSchema_Model if find none
                    rawResult: false,
                    useFindAndModify: false //true is deprecated node:21996 2021-05-12
                },
                //Callback introduces a duplicate newComments when we want only one
            );
            if (Imp_Helper_objectHelper.isNullOrEmpty(vDB_post)) {
                throw 'Post was not updated with new EmoteID'
            };
            //No errors to updating Post or Comment with new EmoteID. Create new Emote
            let vDB_newEmote = null;
            vDB_newEmote = await vNewEmote.save();
            if (Imp_Helper_objectHelper.isNullOrEmpty(vDB_newEmote)) {
                throw new Imp_UserInputError('Emote not saved');
            };
            return { status: 'successful' };
        } catch (err) {
            console.log(err);
            return { status: 'unsuccessful' }
        }
    },

    //Params notes: 
    //  PostID: to identify if Comment's parent to delete is a Post of Comment therefore know which schema model to use
    //  PostID or CommentID: to delete and it's descendents/children
    deletePostOrComment: async (_: string, body: { postID: string, commentID: string }, context: { [key: string]: any }): Promise<any> => {
        try {
            const vUser_Authenticated = await Imp_auth.authChecker(context);
            if (!vUser_Authenticated) {
                throw 'Unauthorised access';
            };
            const vPostID = body.postID?.trim(); //Also used to identify Model Schema for Comment's Parent removal of Post/CommentID
            const vCommentID = body.commentID?.trim();
            //Identify which Post or Comment will be deleted
            let vPostOrCommentID_ToDelete = vPostID;
            let vDBSchemaModel_ToDeleteFrom = Imp_Post.PostSchema_Model;
            if (Imp_Helper_objectHelper.isObjectID(vCommentID) === null) {
                vPostOrCommentID_ToDelete = vCommentID;
                vDBSchemaModel_ToDeleteFrom = Imp_Post.CommentSchema_Model;
            };
            vPostOrCommentID_ToDelete = vPostOrCommentID_ToDelete?.trim();
            if (Imp_Helper_objectHelper.isObjectID(vPostOrCommentID_ToDelete) != null) {
                throw 'Invalid postID';
            };
            //Check if the Post and/or Comment IDs provided exist in our Database
            let vDB_PostOrComment_To_Delete = null;
            let vDB_Post = null;
            vDB_PostOrComment_To_Delete = await vDBSchemaModel_ToDeleteFrom.findById(vPostOrCommentID_ToDelete);
            //TODO: if tests pass.. then the below line can go
            /*if (!(Imp_Helper_objectHelper.isNullOrEmpty(vPostID)) && vPostID != vPostOrCommentID_ToDelete) {
                vDB_Post = await Imp_Post.PostSchema_Model.findById(vPostID);
            };*/
            if (Imp_Helper_objectHelper.isNullOrEmpty(vDB_PostOrComment_To_Delete)
                //TODO: if tests pass.. then the below line can go
                /*|| (!(Imp_Helper_objectHelper.isNullOrEmpty(vPostID)) && Imp_Helper_objectHelper.isNullOrEmpty(vDB_Post))*/) {
                throw 'Post or Comment not found'
            };
            if (vUser_Authenticated._id != vDB_PostOrComment_To_Delete.user) { //Only Creator of the Post/Comment can delete it
                throw 'Unauthorized action - Post creator required';
            };
            //Aggregation - Pipeline & GraphLookup
            //Comments hierachy flattened
            const vDB_PostOrComment_To_Delete_with_CommentsHierarchy = await vDBSchemaModel_ToDeleteFrom.aggregate([  //https://docs.mongodb.com/manual/core/aggregation-pipeline/
                { $match: { _id: vDB_PostOrComment_To_Delete._id } }           //https://mongoosejs.com/docs/api/aggregate.html#aggregate_Aggregate-graphLookup
            ]).graphLookup({ //Returns all descendents objects on the same level in matching object's property named <option: as>
                from: 'comments', startWith: '$_id',                //maxDepth: 0 => populates 0th level of array i.e. only what is seen in array
                connectFromField: '_id', connectToField: 'parent',  //maxDepth: 1 => populates 0th & 1st level of array then lists all objects on the same level
                as: 'commentsHierarchy', maxDepth: 1000              //maxDepth: nth => populates 0th & 1st & 2nd -> nth level
            });
            let vEmotesArray_To_Delete = vDB_PostOrComment_To_Delete_with_CommentsHierarchy[0] //Post or Comment to delete's childrens' emotePreviews
                .commentsHierarchy.map((comment: any) => (
                    comment.emotePreviews.map((emotePreview: any) => (emotePreview.emote))
                ));
            vEmotesArray_To_Delete = vEmotesArray_To_Delete.flat(); //Flatten any nested
            //FIXME: Comments for debugging
            /*console.log("vEmotesArray_To_Delete"); console.log(vEmotesArray_To_Delete);
            console.log('\n vDB_PostOrComment_To_Delete_with_CommentsHierarchy done');
            console.log(vDB_PostOrComment_To_Delete_with_CommentsHierarchy);
            console.log('vDB_PostOrComment_To_Delete_with_CommentsHierarchy[0].commentsHierarchy done');
            console.log(vDB_PostOrComment_To_Delete_with_CommentsHierarchy[0].commentsHierarchy[0]);
            console.log('\n ***starting to delete');*/
            //Remove from Parent's list of ID references of the Post or Comment
            if (Imp_Helper_objectHelper.isObjectID(vDB_PostOrComment_To_Delete.parent) == null) {
                console.log('\n executing findByIdAndUpdate');
                let vDB_SchemaModel_Parent_ToUpdate = Imp_Post.PostSchema_Model; //Identify Model Schema for Comment's Parent
                if (vPostID != vDB_PostOrComment_To_Delete.parent) {
                    vDB_SchemaModel_Parent_ToUpdate = Imp_Post.CommentSchema_Model;
                };
                await vDB_SchemaModel_Parent_ToUpdate.findByIdAndUpdate(
                    { _id: vDB_PostOrComment_To_Delete.parent },
                    { $pull: { comments: vDB_PostOrComment_To_Delete._id } },
                    { useFindAndModify: false },
                    (error, response) => {
                        console.log("***error on findByIdAndUpdate"); console.log(!Imp_Helper_objectHelper.isNullOrEmpty(error));
                        console.log("***response on findByIdAndUpdate"); console.log(!Imp_Helper_objectHelper.isNullOrEmpty(response));
                    }
                );
            } else {
                console.log("***vDB_PostOrComment_To_Delete.parent) === null >>> only for parent of type Post because Posts don't have Parents for now");
                console.log(Imp_Helper_objectHelper.isObjectID(vDB_PostOrComment_To_Delete.parent));
                //FIXME: allow for now.. development in progress until Profiles come along
            };
            //Delete (cascade) Emotes associated with Post or Comment to delete
            console.log('\n ***executing EmoteSchema_Model.deleteMany');
            const vEmotes_Deleted_Response = await Imp_Post.EmoteSchema_Model.deleteMany(
                {
                    _id: {
                        $in: [
                            ...vDB_PostOrComment_To_Delete_with_CommentsHierarchy[0].emotePreviews.map((emotePreview: any) => (emotePreview.emote)), //Post's or Comment's emotePreviews
                            ...vEmotesArray_To_Delete //and its childrens' emotePreviews
                        ],
                    }
                }
            );
            console.log("***response on deleteMany (EmoteSchema_Model responseObj): "); console.log('disabledComment>>> vEmotes_Deleted_Response');
            //Delete Comments associated with Post or Comment to delete
            console.log('\n ***executing CommentSchema_Model.deleteMany');
            const vComments_Deleted_Response = await Imp_Post.CommentSchema_Model.deleteMany(
                {
                    _id: {
                        $in: [
                            ...vDB_PostOrComment_To_Delete_with_CommentsHierarchy[0].commentsHierarchy.map((comment: any) => (comment._id)),

                        ],
                    }
                }
            );
            console.log("***response on deleteMany (CommentSchema_Model responseObj): "); console.log('disabledComment>>> vComments_Deleted_Response');
            //Delete Post or Comment itself
            console.log('\n ***executing vDB_PostOrComment_To_Delete.remove');
            await vDB_PostOrComment_To_Delete.remove();

            return { status: 'successful' }
        } catch (err) {
            console.log(err);
            //FIXME: Log this as an exception for Tech Support to review. Required: Action timestamp, User, Collection, ObjectID, Error Message, StackTrace, RequestBody omit Credentials/ip-address
            //       distinguish between types of errors
            //       create a standard for handling errors - to return error string with error http status code
            //                                              and when to create an exception (maybe for when something needs technical support)
            //throw new Imp_AuthenticationError('Unauthorized action');
            return { status: 'unsuccessful' }
        }
    }
};

const Subscription = {
    newPost: {
        subscribe: (_: any, __: any, context: { pubsub: any }) =>
            context.pubsub.asyncIterator('NEW_POST')
    }
};

export const posts = {
    Query,
    Mutation,
    Subscription
};