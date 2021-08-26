/**************************************************************************
 * CREATOR: JACKY S
 * CREATED ON: May 2021
 * BACKLOG ITEM ID: <MVP_001>
 * DESCRIPTION: Index Resolver - Collates all resolvers
 * 
 * CHANGE HISTORY
 * =======================
 * DATE    BACKLOG ITEM   USER  DESCRIPTION 
 * 
**************************************************************************/

import { posts as Imp_posts } from './posts';
import { comments as Imp_comments } from './comments';
import { users as Imp_users } from './users';
import { objectHelper as Imp_helper_objectHelper } from '../../util/objectHelper'

const shared_CommentPost_resolvers = { //Had to put it up here since lazy loading
  commentsCount(parent: any) {
    try {
      if (Imp_helper_objectHelper.hasOwnProperty(parent, 'comments')) {
        return parent.comments.length;
      }
    } catch (err) {
      console.log(err);
    }
  },
  emotePreviewsCount(parent: any) {
    try {
      if (Imp_helper_objectHelper.hasOwnProperty(parent, 'emotePreviews')) {
        return parent.emotePreviews.length;
      }
    } catch (err) {
      console.log(err);
    }
  }
};

const resolvers = {
  Query: {
    ...Imp_posts.Query,
    ...Imp_users.Query
  },
  Mutation: {
    ...Imp_posts.Mutation,
    ...Imp_comments.Mutation,
    ...Imp_users.Mutation
  },
  Subscription: {
    ...Imp_posts.Subscription
  },
  //
  //Return type post-processing back to Client
  //
  Post: {
    ...shared_CommentPost_resolvers
  },
  Comment: {
    ...shared_CommentPost_resolvers
  },
  //
  //Below are unused
  //
  IMessage: { __resolveType() { return null; } },
  IUser: { __resolveType() { return null; } },
};

export const index = {
  resolvers
};