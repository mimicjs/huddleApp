import React, { useState, useContext, useRef } from 'react';

import { useMutation, useQuery } from '@apollo/react-hooks';
import { AuthContext } from '../../../context/auth';
import { MAIN_SERVER, GET_POSTS, CREATE_POST, CREATE_COMMENT, GET_POST_OR_COMMENT_QUERY, DELETE_POST_OR_COMMENT, EMOTE_POST_OR_COMMENT } from '../../../API/API';

import CircularProgress from '@material-ui/core/CircularProgress';

import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import barMenusStyle from "assets/jss/mkr/components/barMenusStyle";
import dashboardStyle, { ConversationsGridStyle, ConversationsGridBodyStyle, ConversationsGridTextEditorAreaStyle } from "assets/jss/mkr/views/dashboardPage";
import { makeStyles } from "@material-ui/core/styles";
import { styled } from '@material-ui/core/styles';

import GridItem from "components/Grid/GridItem";
import CustomButton from "../../../components/CustomButtons/Button";
import TextEditor from '../../../components/TextEditor/TextEditor';
import { AppBar, TaskNavbar, ChannelBar } from '../BarMenus';
import { ConversationsGridHeader, ConversationsGridBody } from './ConversationsGrid';

export default function Dashboard(props) {
  const { Access_Session } = useContext(AuthContext);
  Access_Session(); //On re-render check for valid Access Token.. 

  //
  //Children Refs
  //
  const isScrollToBottomDisabledRef = useRef(false); //Allow scroll to scroll to bottom (e.g. on Mount or this user made a new Post)
  const conversationsGridScrollRef = useRef(0); //Updated as User scrolls
  const previousRenderConversationsGridScrollHeightRef = useRef(0); //Before rerender - the scroll's height
  
  //
  //CSS & STYLES
  //
  const mergedStyles = { ...dashboardStyle, loadingScreen: barMenusStyle.loadingScreen, loadingScreenFadeOut: barMenusStyle.loadingScreenFadeOut};
  const useStyles = makeStyles(theme => mergedStyles);
  const classes = useStyles();

  const ConversationsGridStyled = styled(Box)(
    ({ theme }) => ConversationsGridStyle(theme)
  );

  const ConversationsGridBodyStyled = styled(Box)(
    ({ theme }) => ConversationsGridBodyStyle(theme)
  );

  const ConversationsGridTextEditorAreaStyled = styled(Box)(
    ({ theme }) => ConversationsGridTextEditorAreaStyle(theme)
  );

  const [isLoadingScreenOn, setIsLoadingScreenOn] = useState(true);

  const [channelBarClosed, setChannelBarClosed] = useState(false);
  function toggleTaskbarDrawer() { //to pass as props, omit the '()' to avoid self-executing function
    setChannelBarClosed(!channelBarClosed);
  };

  //
  //GET POSTS (POLLING) //TODO: Convert to Subscription from Polling
  //
  const getPostsArrayRef = useRef();
  const getPostsPollingIntervalRef = useRef(2000);
  const [getPostsErrors, setGetPostFormErrors] = useState();
  const [getPostsErrorCount, setGetPostsErrorCount] = useState(0);
  const { data: vGetPosts_data, error: vGetPosts_error } = useQuery(GET_POSTS, {
    returnPartialData: false,
    fetchPolicy: 'no-cache',
    pollInterval: getPostsPollingIntervalRef.current, //This will re-render the Dashboard
    skip: (getPostsErrorCount > 3)
  });
  if (vGetPosts_data || vGetPosts_error) {
    let errorsArray = [];
    if (vGetPosts_data !== null && typeof vGetPosts_data === 'object' && vGetPosts_data.getPosts) {
      console.log('new posts... updating getPostsArrayRef.current');
      getPostsArrayRef.current = vGetPosts_data.getPosts;
    }
    else {
      if (vGetPosts_error && vGetPosts_error.graphQLErrors && vGetPosts_error.graphQLErrors.length > 0) {
        Object.values(Object.values(vGetPosts_error.graphQLErrors[0].extensions)[0]).forEach(errorMessage => {
          errorsArray.push(errorMessage);
        })
      }
      else {
        errorsArray.push('Request issue. Please try again later');
      };
      console.log('onError encountered'); //Iterable by map
      console.log(errorsArray);
      if (getPostsErrorCount > 3) {
        setGetPostFormErrors(errorsArray);
        getPostsPollingIntervalRef.current = 0;
      }
      setGetPostsErrorCount(getPostsErrorCount + 1);
    }
  }

  //
  //CREATE POST
  //
  const [createPostErrors, setCreatePostErrors] = useState();
  function processCreatePost(pTextEditorID) {
    const vTextEditorCreatePost = document.getElementById(pTextEditorID);
    if (vTextEditorCreatePost && vTextEditorCreatePost.value.trim() !== '') {
      setCreatePostErrors();
      createPost({ variables: { ParentID: '', Body: vTextEditorCreatePost.value.trim() } }).then(
        vTextEditorCreatePost.value = ''
      );
    }
  }
  const [createPost] = useMutation(CREATE_POST, {
    update(proxy, { data: { createPost: createPost_SuccessResponse } }) {
      if (createPost_SuccessResponse !== null && typeof createPost_SuccessResponse === 'object'
        && Object.keys(createPost_SuccessResponse).length > 0 && createPost_SuccessResponse.status === 'successful') {
        isScrollToBottomDisabledRef.current = false;
        console.log("successfully created post in DB")
      } else {
        console.log("failed to created post in DB")
      }
      return null;
    },
    onError({ graphQLErrors, networkError }) {
      let errorsArray = [];
      if (graphQLErrors && graphQLErrors.length > 0) { /*happens inside resolvers*/
        Object.values(Object.values(graphQLErrors[0].extensions)[0]).forEach(errorMessage => {
          errorsArray.push(errorMessage);
        })
      }
      else {
        errorsArray.push('Request issue. Please try again later');
      };
      setCreatePostErrors(errorsArray); //Iterable by map
    }
  });

  //
  //CREATE COMMENT
  //
  const vPostIDOfCollectionToUpdate = useRef();
  const [createCommentErrors, setCreateCommentErrors] = useState();
  function submitCreateComment(pTextEditorIDPrefix, pPostID, pCommentID) {
    const vTextEditorCreateComment = document.getElementById(pTextEditorIDPrefix + pPostID);
    if (vTextEditorCreateComment && vTextEditorCreateComment.value.trim() !== '') {
      setCreateCommentErrors();
      vPostIDOfCollectionToUpdate.current = pPostID;
      createComment({ variables: { PostID: pPostID, CommentBody: vTextEditorCreateComment.value.trim() } })
        .then(() => {
          vTextEditorCreateComment.value = '';
          const vRowIDsToShowReplyBox = [...rowIDsToShowReplyBox];
          if (vRowIDsToShowReplyBox.includes(pPostID)) { //Close Reply Box
            vRowIDsToShowReplyBox.splice(vRowIDsToShowReplyBox.indexOf(pPostID), 1);
            setRowIDsToShowReplyBox(vRowIDsToShowReplyBox);
          }
        });
    }
  }
  const [createComment] = useMutation(CREATE_COMMENT, {
    update(proxy, { data: { createComment: createComment_SuccessResponse } }) {
      if (createComment_SuccessResponse !== null && typeof createComment_SuccessResponse === 'object'
        && Object.keys(createComment_SuccessResponse).length > 0 && createComment_SuccessResponse.status === 'successful') {
        console.log("successfully created comment in DB")
        if (vPostIDOfCollectionToUpdate.current) { //Allows the comment to be refreshed with updated emote state
          processGetPostOrCommentByID(vPostIDOfCollectionToUpdate.current, null);
        }
      } else {
        console.log("failed to created comment in DB")
      }
      return null;
    },
    onError({ graphQLErrors, networkError }) {
      let errorsArray = [];
      if (graphQLErrors && graphQLErrors.length > 0) { /*happens inside resolvers*/
        Object.values(Object.values(graphQLErrors[0].extensions)[0]).forEach(errorMessage => {
          errorsArray.push(errorMessage);
        })
      }
      else {
        errorsArray.push('Request issue. Please try again later');
      };
      setCreateCommentErrors(errorsArray); //Iterable by map
    }
  });

  //
  //GET POST OR COMMENT
  //
  const [commentsCollection, setCommentsCollection] = useState({});
  const [getPostOrCommentErrors, setGetPostOrCommentErrors] = useState();
  function processGetPostOrCommentByID(pPostID, pCommentID) {
    if ((pPostID && !pCommentID) || (!pPostID && pCommentID)) {
      setGetPostOrCommentErrors();
      GetPostOrCommentByID(pPostID, pCommentID);
    } else {
      setGetPostOrCommentErrors(['Post or Comment could not be retrieved at this time. Try again later.']);
    }
  }
  async function GetPostOrCommentByID(pPostID, pCommentID) {
    let vGetPostOrComment_data = null;
    let vGetPostOrComment_error = null;

    await fetch((MAIN_SERVER + window.location.pathname), {
      method: "POST",
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: GET_POST_OR_COMMENT_QUERY,
        variables: { PostID: pPostID, CommentID: pCommentID }
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        vGetPostOrComment_data = response.data.getPostOrComment;
        if (vGetPostOrComment_data !== null && typeof vGetPostOrComment_data === 'object'
          && Object.keys(vGetPostOrComment_data).length > 0 && vGetPostOrComment_data._id.length >= 20) {
          console.log("successfully retrieved post or comment from DB");
          const newCommentsCollection = { ...commentsCollection };
          newCommentsCollection[vGetPostOrComment_data._id] = vGetPostOrComment_data.comments;
          setCommentsCollection(newCommentsCollection);
        } else {
          console.log("failed to retrieve post or comment from DB")
        };
      })
      .catch((error) => {
        vGetPostOrComment_error = error;
        let errorsArray = [];
        if (vGetPostOrComment_error) {
          const graphQLErrors = vGetPostOrComment_error.graphQLErrors;
          if (graphQLErrors && graphQLErrors.length > 0) {
            Object.values(Object.values(graphQLErrors[0].extensions)[0]).forEach(errorMessage => {
              errorsArray.push(errorMessage);
            })
          }
          else {
            errorsArray.push('Request issue. Please try again later');
          };
          setGetPostOrCommentErrors(errorsArray);
        }
      })
    //awaiting response from fetch
  }

  //
  //EMOTE VOTE POST OR COMMENT
  //
  const [emotePostOrCommentErrors, setEmotePostOrCommentErrors] = useState();
  function processEmotePostOrComment(pPostID, pCommentID, pEmoteID, pEmoticon, pPostIDOfCollectionToUpdate) {
    if (!((pPostID && !pCommentID) || (!pPostID && pCommentID)) || !pEmoticon) {
      setEmotePostOrCommentErrors(['Emote could not be processed at this time. Try again later.']);
    }
    setEmotePostOrCommentErrors();
    vPostIDOfCollectionToUpdate.current = pPostIDOfCollectionToUpdate;
    emotePostOrComment({
      variables: {
        PostID: pPostID,
        CommentID: pCommentID,
        EmoteID: pEmoteID,
        Emoticon: pEmoticon
      }
    });
  }
  const [emotePostOrComment] = useMutation(EMOTE_POST_OR_COMMENT, {
    update(proxy, { data: { emotePostOrComment: emotePostOrComment_SuccessResponse } }) {
      if (emotePostOrComment_SuccessResponse !== null && typeof emotePostOrComment_SuccessResponse === 'object'
        && Object.keys(emotePostOrComment_SuccessResponse).length > 0
        && (emotePostOrComment_SuccessResponse.status === 'successful')) {
        console.log("successfully emote post or comment in DB")
        if (vPostIDOfCollectionToUpdate.current) { //Allows the comment to be refreshed with updated emote state
          processGetPostOrCommentByID(vPostIDOfCollectionToUpdate.current, null);
        }
      } else {
        console.log("failed to emote post or comment post in DB")
      }
      return null;
    },
    onError({ graphQLErrors, networkError }) {
      let errorsArray = [];
      if (graphQLErrors && graphQLErrors.length > 0) { /*happens inside resolvers*/
        Object.values(Object.values(graphQLErrors[0].extensions)[0]).forEach(errorMessage => {
          errorsArray.push(errorMessage);
        })
      }
      else {
        errorsArray.push('Request issue. Please try again later');
      };
      setEmotePostOrCommentErrors(errorsArray); //Iterable by map
    }
  });

  //
  //DELETE POST OR COMMENT
  //
  const [deletePostOrCommentErrors, setDeletePostOrCommentErrors] = useState();
  function processDeletePostOrComment(pPostID, pCommentID, pPostIDOfCollectionToUpdate) {
    if (!((pPostID && !pCommentID) || (!pPostID && pCommentID))) {
      setDeletePostOrCommentErrors(['Post or Comment could not be deleted at this time. Try again later.']);
    } else {
      setDeletePostOrCommentErrors();
      vPostIDOfCollectionToUpdate.current = pPostIDOfCollectionToUpdate;
      deletePostOrComment({ variables: { PostID: pPostID, CommentID: pCommentID } })
    }
  }
  const [deletePostOrComment] = useMutation(DELETE_POST_OR_COMMENT, {
    update(proxy, { data: { deletePostOrComment: deletePostOrComment_SuccessResponse } }) {
      if (deletePostOrComment_SuccessResponse !== null && typeof deletePostOrComment_SuccessResponse === 'object'
        && Object.keys(deletePostOrComment_SuccessResponse).length > 0 && deletePostOrComment_SuccessResponse.status === 'successful') {
        console.log("successfully deleted post/comment in DB")
        if (vPostIDOfCollectionToUpdate.current) { //Allows the comment to be refreshed with updated emote state
          processGetPostOrCommentByID(vPostIDOfCollectionToUpdate.current, null);
        }
      } else {
        console.log("failed to delete post/comment in DB")
      }
      return null;
    },
    onError({ graphQLErrors, networkError }) {
      let errorsArray = [];
      if (graphQLErrors && graphQLErrors.length > 0) { /*happens inside resolvers*/
        Object.values(Object.values(graphQLErrors[0].extensions)[0]).forEach(errorMessage => {
          errorsArray.push(errorMessage);
        })
      }
      else {
        errorsArray.push('Request issue. Please try again later');
      };
      setDeletePostOrCommentErrors(errorsArray); //Iterable by map
    }
  });


  //
  //REPLY & COMMENT display toggles
  //
  const [rowIDsToShowReplyBox, setRowIDsToShowReplyBox] = useState([]);
  const [rowIDsToShowComments, setRowIDsToShowComments] = useState([]);

  //
  //COMPONENT'S COMPONENT_DID_MOUNT
  //
  function OnDOMLoad() {
    if (isLoadingScreenOn) {
      setTimeout(() => setIsLoadingScreenOn(false), 500); //Delay by 500ms
    }
  }

  return (
    <Box>
      {isLoadingScreenOn ?
        <div className={classes.loadingScreen}>
          <CircularProgress />
        </div>
        :
        <div className={classes.loadingScreenFadeOut} />
      }
      <CssBaseline />
      <div className={classes.rootContainer}>
        <AppBar classes={classes}/>
        <GridItem className={classes.rootGrid} xs={12}>
          <TaskNavbar classes={classes} />
          <ChannelBar classes={classes}
            open={!channelBarClosed}
            variant="permanent"
            toggleOpenChannel={toggleTaskbarDrawer}
          />
          <ConversationsGridStyled>
            <GridItem xs={12}>
              <ConversationsGridHeader classes={classes}
                toggleTaskbarDrawer={toggleTaskbarDrawer} />
            </GridItem>
            <ConversationsGridBodyStyled>
              <ConversationsGridBody classes={classes}
                key={'ConversationsGridBody'}
                componentDidMount={OnDOMLoad}
                postsArray={getPostsArrayRef.current ? getPostsArrayRef.current : null}
                processGetPostOrCommentByID={processGetPostOrCommentByID}
                commentsCollection={commentsCollection}
                rowIDsToShowComments={rowIDsToShowComments}
                setRowIDsToShowComments={setRowIDsToShowComments}
                rowIDsToShowReplyBox={rowIDsToShowReplyBox}
                setRowIDsToShowReplyBox={setRowIDsToShowReplyBox}
                submitCreateComment={submitCreateComment}
                processEmotePostOrComment={processEmotePostOrComment}
                processDeletePostOrComment={processDeletePostOrComment}
                isScrollToBottomDisabledRef={isScrollToBottomDisabledRef}
                conversationsGridScrollRef={conversationsGridScrollRef}
                previousRenderConversationsGridScrollHeightRef={previousRenderConversationsGridScrollHeightRef}
              />
            </ConversationsGridBodyStyled>
            <ConversationsGridTextEditorAreaStyled>
              {/* notification bar or popup for these below errors */}
              {getPostsErrors ? 'getPostsErrors: ' + getPostsErrors : null}
              {createPostErrors ? 'createPostErrors: ' + createPostErrors : null}
              {createCommentErrors ? 'createCommentErrors: ' + createCommentErrors : null}
              {getPostOrCommentErrors ? 'getPostOrCommentErrors: ' + getPostOrCommentErrors : null}
              {deletePostOrCommentErrors ? 'deletePostOrCommentErrors: ' + deletePostOrCommentErrors : null}
              {emotePostOrCommentErrors ? 'emotePostOrCommentErrors: ' + emotePostOrCommentErrors : null}
              <TextEditor id="conversations-textEditor-createPost" classes={classes} />
              <CustomButton className={classes.submitButton} onClick={() => processCreatePost('conversations-textEditor-createPost')} color={"huddle"} size={"sm"} fullWidth children={"Send"} />
            </ConversationsGridTextEditorAreaStyled>
          </ConversationsGridStyled>
        </GridItem>
      </div>
    </Box>
  );
}
