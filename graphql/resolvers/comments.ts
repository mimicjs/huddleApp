/**************************************************************************
 * CREATOR: JACKY S
 * CREATED ON: May 2021
 * BACKLOG ITEM ID: <MVP_001>
 * DESCRIPTION: Resolver for Comments-related queries
 * 
 * CHANGE HISTORY
 * =======================
 * DATE    BACKLOG ITEM   USER  DESCRIPTION 
 * 
**************************************************************************/

import { ApolloError as Imp_ApolloError, UserInputError as Imp_UserInputError, AuthenticationError as Imp_AuthenticationError } from 'apollo-server-express';

import { Post as Imp_Post } from '../../models/Post';
import { auth as Imp_auth } from '../../util/auth';
import { objectHelper as Imp_Helper_objectHelper } from '../../util/objectHelper';

const Mutation = {
    createComment: async (_: '', body: { postID: string|null, commentID: string|null, commentBody: string|null }, context: { [key: string]: any }): Promise<any> => {
        try {
            const vPostID = body.postID?.trim(); //If empty then new Comment was made on Comment
            const vCommentID = body.commentID?.trim();//If empty then new Comment was made on Post
            const vCommentBody = body.commentBody?.trim();
            const vUser_Authenticated = await Imp_auth.authChecker(context);
            if (!vUser_Authenticated) {
                throw new Imp_AuthenticationError('Unauthorised access');
            };
            if (Imp_Helper_objectHelper.isNullOrEmpty(vCommentBody)) {
                throw new Imp_UserInputError('Empty comment', {
                    errors: {
                        body: 'Enter a valid comment'
                    }
                });
            };
            if (Imp_Helper_objectHelper.isObjectID(vPostID) !== null) { //invalid PostID then Comment on Comment
                if (Imp_Helper_objectHelper.isObjectID(vCommentID) !== null) { //invalid PostID and CommentID => exception
                    throw new Imp_UserInputError('Invalid vPostID and/or vCommentID', {
                        errors: {
                            body: 'Enter a valid vPostID and/or vCommentID'
                        }
                    });
                }
            };
            //Making a Comment on Parent therefore update Parent's comments to show new CommentID
            let vParentID = vPostID;
            let vDBSchemaModel = Imp_Post.PostSchema_Model;
            if (Imp_Helper_objectHelper.isObjectID(vCommentID) === null) {
                vParentID = vCommentID;
                vDBSchemaModel = Imp_Post.CommentSchema_Model;
            };
            const vNewComment = new Imp_Post.CommentSchema_Model({
                parent: vParentID,
                createdAt: new Date().toISOString(), //standard format to use. ISO > (UTC & GMT).
                user: vUser_Authenticated._id,
                body: vCommentBody //string.trimRight() is an alias of string.trimEnd()
            });
            //Parent of new Comment needs to know this child comment
            const vDB_Post = await vDBSchemaModel.findByIdAndUpdate({ _id: vParentID },
                { $push: { comments: vNewComment._id } },
                {
                    new: true,
                    upsert: false,
                    rawResult: false,
                    useFindAndModify: false,
                    lean: true
                },
            );
            if (Imp_Helper_objectHelper.isNullOrEmpty(vDB_Post)) {
                throw new Imp_UserInputError('Post or Comment not found');
            };
            //Save new Comment to Collection only when Post/Comment found
            const vDB_Comment = await vNewComment.save();
            if (Imp_Helper_objectHelper.isNullOrEmpty(vDB_Comment)) {
                throw new Imp_ApolloError("Internal Server error");
            }
            console.log(vDB_Post);
            return { status: 'successful' }

        } catch (err) {
            console.log(err);
            return { status: 'unsuccessful' }
        }
    }
};

export const comments = {
    Mutation
};