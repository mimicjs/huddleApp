import gql from 'graphql-tag';

export const MAIN_SERVER = process.env.NODE_ENV === 'production' ? 'https://huddleapp-server.herokuapp.com' : 'http://localhost:5000';

const REGISTER_USER = gql`
    mutation Register(
    $Email: String!
    $Username: String!
    $FullName: String!
    $Password: String!
    ){
    register(
        registerInput: {
            email: $Email
            username: $Username
            userFullName: $FullName
            password: $Password
        }
    ){
        status
    }}
`;

const LOGIN_USER = gql`
    mutation Login(
        $Username: String!
        $Password: String!
    ){
        login(
            username: $Username,
            password: $Password
        ){
            status
        }
    }
`;

const ACCESS_SESSION = gql`
    {
        getAccess {
            status
            userID
            userFullName
        }
    }
`

const LOGOUT_SESSION = gql`
    {
        getLogout {
            status
        }
    }
`

const GET_POSTS = gql`
    {
        getPosts {
            _id
            parent
            body
            user {
            _id
            username
            userFullName
            password
            }
            comments {
            _id
            parent
            body
            user {
                _id
                username
                userFullName
                password
            }
            emotePreviews {
                user
                emote {
                _id
                user {
                    _id
                    username
                    userFullName
                    password
                }
                parent
                emoticon
                createdAt
                }
            }
            emotePreviewsCount
            comments {
                _id
                body
                parent
                user {
                _id
                username
                userFullName
                password
                }
                comments {
                _id
                body
                user {
                    _id
                    username
                    userFullName
                    password
                }
                comments {
                    _id
                    body
                    parent
                    user {
                    _id
                    username
                    userFullName
                    password
                    }
                    comments {
                    _id
                    body
                    }
                    commentsCount
                    emotePreviews {
                    user
                    emote {
                        _id
                        user {
                        _id
                        username
                        userFullName
                        password
                        }
                        parent
                        emoticon
                        createdAt
                    }
                    }
                    emotePreviewsCount
                    createdAt
                }
                createdAt
                }
                commentsCount
                emotePreviews {
                user
                emote {
                    _id
                    user {
                    _id
                    username
                    userFullName
                    password
                    }
                    parent
                    emoticon
                    createdAt
                }
                }
                emotePreviewsCount
                createdAt
            }
            commentsCount
            createdAt
            }
            commentsCount
            emotePreviews {
            user
            emote {
                _id
                user {
                _id
                username
                userFullName
                password
                }
                parent
                emoticon
                createdAt
            }
            }
            emotePreviewsCount
            createdAt
        }
    }
`;

const CREATE_POST = gql`
    mutation CreatePost(
        $ParentID: String
        $Body: String!
    ) {
        createPost(
            parentID: $ParentID, 
            body: $Body
        ) {
            status
        }
    }
`

const CREATE_POST_GST_QUERY = `
    mutation CreatePostGst(
        $Body: String!
    ) {
        createPostGuest(
            body: $Body
        ) {
            status
        }
    }
`

const GET_POST_OR_COMMENT_QUERY = `
    query getPostOrComment(
        $PostID: String
        $CommentID: String
    ) {
        getPostOrComment(
            postID: $PostID,
            commentID: $CommentID
        ) {
            _id
            parent
            body
            user {
                _id
                username
                userFullName
                password
            }
            comments {
                _id
                parent
                body
                user {
                    _id
                    username
                    userFullName
                }
                emotePreviews {
                    user
                    emote {
                        _id
                        user {
                            _id
                            username
                            userFullName
                        }
                        parent
                        emoticon
                        createdAt
                    }
                }
                emotePreviewsCount
                comments {
                    _id
                    body
                    parent
                    user {
                        _id
                        username
                        userFullName
                    }
                    comments {
                        _id
                        body
                        user {
                            _id
                            username
                            userFullName
                        }
                        comments {
                            _id
                            body
                            parent
                            user {
                                _id
                                username
                                userFullName
                            }
                            comments {
                                _id
                                body
                            }
                            commentsCount
                            emotePreviews {
                                user
                                emote {
                                    _id
                                    user {
                                        _id
                                        username
                                        userFullName
                                    }
                                    parent
                                    emoticon
                                    createdAt
                                }
                            }
                            emotePreviewsCount
                            createdAt
                        }
                        createdAt
                    }
                    commentsCount
                    emotePreviews {
                        user
                        emote {
                            _id
                            user {
                                _id
                                username
                                userFullName
                            }
                            parent
                            emoticon
                            createdAt
                        }
                    }
                    emotePreviewsCount
                    createdAt
                }
                commentsCount
                createdAt
            }
            commentsCount
            emotePreviews {
                user
                emote {
                    _id
                    user {
                        _id
                        username
                        userFullName
                    }
                    parent
                    emoticon
                    createdAt
                }
            }
            emotePreviewsCount
            createdAt
        }
    }
`

const GET_POST_OR_COMMENT = gql(GET_POST_OR_COMMENT_QUERY);


const CREATE_COMMENT = gql`
    mutation createComment(
        $PostID: String
        $CommentID: String
        $CommentBody: String!
    ) {
        createComment(
            postID: $PostID,
            commentID: $CommentID,
            commentBody: $CommentBody
        ) {
            status
      }
    }
`

const DELETE_POST_OR_COMMENT = gql`
    mutation deletePostOrComment(
        $PostID: String
        $CommentID: String
    ) {
        deletePostOrComment(
            postID: $PostID, 
            commentID: $CommentID
        ) {
            status
        }
    }
`

const EMOTE_POST_OR_COMMENT = gql`
    mutation emotePostOrComment(
        $PostID: String
        $CommentID: String
        $EmoteID: String
        $Emoticon: String!
    ) {
        emotePostOrComment(
            postID: $PostID, 
            commentID: $CommentID
            emoteID: $EmoteID
            emoticon: $Emoticon
        ) {
            emote {
                _id
                parent
                emoticon
                user{
                    _id
                }
                createdAt
                }
            status
        }
    }
`

export {
    CREATE_POST_GST_QUERY,
    REGISTER_USER,
    LOGIN_USER,
    ACCESS_SESSION,
    LOGOUT_SESSION,
    GET_POSTS,
    CREATE_POST,
    GET_POST_OR_COMMENT,
    GET_POST_OR_COMMENT_QUERY,
    CREATE_COMMENT,
    DELETE_POST_OR_COMMENT,
    EMOTE_POST_OR_COMMENT,
};