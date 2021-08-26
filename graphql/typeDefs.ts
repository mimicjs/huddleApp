/**************************************************************************
 * CREATOR: JACKY S
 * CREATED ON: May 2021
 * BACKLOG ITEM ID: <MVP_001>
 * DESCRIPTION: GraphQL typeDefs
 * 
 * CHANGE HISTORY
 * =======================
 * DATE    BACKLOG ITEM   USER  DESCRIPTION 
 * 
**************************************************************************/

import { gql } from 'apollo-server-express'; //Remains gql and not Imp_gql. Cannot be intelli-sensed

export const typeDefs = gql`

    interface IMessage{
        _id: ID
        body: String
        user: User
        createdAt: String
        comments: [Comment]
        emotePreviews: [EmotePreview]
    }
    type Post implements IMessage{
        _id: ID
        parent: String
        body: String
        user: User
        createdAt: String
        comments: [Comment]
        commentsCount: Int
        emotePreviews: [EmotePreview]
        emotePreviewsCount: Int
    }
    type Comment implements IMessage{
        _id: ID
        parent: String
        body: String
        user: User
        createdAt: String
        comments: [Comment]
        commentsCount: Int
        emotePreviews: [EmotePreview]
        emotePreviewsCount: Int
    }
    type Emote{
        _id: ID
        parent: String
        createdAt: String
        user: User
        emoticon: String
    }
    type EmotePreview{
        emote: Emote
        user: ID
    }
    interface IUser{
        _id: ID
        email: String
        username: String
        userFullName: String
        password: String
        createdAt: String
    }
    type User implements IUser{
        _id: ID
        email: String
        username: String
        userFullName: String
        password: String
        createdAt: String
    }
    type GetAccess_Response{
        status: String
        userID: String
        userFullName: String
    }
    type Status_Result{ 
        status: String
    }
    type Response_EmotePostOrComment{ 
        status: String
        emote: Emote
    }
    input RegisterInput{ #Should inherit IMessage. Input type does not allow inheritance
        _id: ID
        email: String!
        username: String!
        userFullName: String!
        password: String!
        createdAt: String
    }
    type Query{
#TODO: Future: User can access many Servers (approval list and server hierarchy for approval and moderation) 
#      Store new Server DBSchema, Store Server._id onto User & on Login fetch list with names to allow User to select to access
#      Collection of Channels to hold collection of IDs each
#TODO: Future: Perhaps a Marketplace or eCommerce
        getPosts: [Post]
        getPostOrComment(postID: String, commentID: String): Post
        getAccess: GetAccess_Response
        getLogout: Status_Result
    }
    type Mutation{
        login(username: String!, password: String!): Status_Result
        register(registerInput: RegisterInput!): Status_Result
        createPost(parentID: String, body: String!): Status_Result
        createPostGuest(parentID: String, body: String!): Status_Result
        createComment(postID: String, commentID: String, commentBody: String!): Status_Result
        emotePostOrComment(postID: String, commentID: String, emoteID: String, emoticon: String!): Response_EmotePostOrComment
        deletePostOrComment(postID: String, commentID: String): Status_Result #Reason why 'PostOrComment' has Posts and Comments behave in a similar way
    }
    #Subscription via e.g. Websocket maybe something faster?
    #FIXME: https://graphql.org/learn/best-practices/
    type Subscription{
        newPost: Post
    }
`;