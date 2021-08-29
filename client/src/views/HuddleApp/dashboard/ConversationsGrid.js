import React, { useLayoutEffect, useState, useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import { AuthContext } from '../../../context/auth';
import moment from 'moment';
import classNames from 'classnames';

import Box from '@material-ui/core/Box';
import GridItem from "components/Grid/GridItem";

import { DialogWarning } from "../../../components/CustomDialog/CustomDialog";
import Editor from '../../../components/TextEditor/TextEditor';
import CustomButton from "../../../components/CustomButtons/Button";

import { makeStyles } from "@material-ui/core/styles";
import { styled } from '@material-ui/core/styles';
import conversationsGridStyle, { ConversationsGridHeaderStyle } from "assets/jss/mkr/components/conversationsGrid";

import PublicIcon from '@material-ui/icons/Public';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import CommentIcon from '@material-ui/icons/Comment';
import ReplyIcon from '@material-ui/icons/Reply';

import FavoriteIcon from '@material-ui/icons/Favorite';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import DeleteIcon from '@material-ui/icons/Delete';

const ConversationsGridHeaderStyled = styled(Box)(
  ({ theme }) => ConversationsGridHeaderStyle(theme)
);

export const ConversationsGridHeader = React.memo(function ConversationsGridHeaderRender(props) {
  let useStyles = makeStyles(theme => conversationsGridStyle);
  let classes = useStyles();
  classes = { ...classes, ...props.classes };
  return (
    <ConversationsGridHeaderStyled>
      <div className={classes.conversationsGridHeader} onClick={props.toggleTaskbarDrawer}>
        <h4><PublicIcon /><b> General</b></h4>
        <hr />
      </div>
    </ConversationsGridHeaderStyled>
  );
});
ConversationsGridHeader.propTypes = {
  classes: PropTypes.object,
  toggleTaskbarDrawer: PropTypes.func
};

export const ConversationsGridBody = React.memo(function ConversationsGridBodyRender(props) {
  let useStyles = makeStyles(theme => conversationsGridStyle);
  let classes = useStyles();
  classes = { ...classes, ...props.classes };

  const postIDSelectedToDeleteRef = useRef("");
  const commentIDSelectedToDeleteRef = useRef("");

  const { userID } = useContext(AuthContext);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  if (!isDeleteModalOpen) {
    postIDSelectedToDeleteRef.current = "";
    commentIDSelectedToDeleteRef.current = "";
  }

  useLayoutEffect(() => {
    props.componentDidMount();
  });

  //
  //Scroll handler for Conversations Grid
  //
  useLayoutEffect(() => { //useLayoutEffect - Synchronous and before Paint
    scrollConversationsGrid();
  });
  function setPreviousConversationsGridScrollRef(pScrollTopValue) {
    props.conversationsGridScrollRef.current = pScrollTopValue;
  }
  function scrollConversationsGrid() {
    const mainSectionGridBody = document.getElementById("conversations-mainsection-grid-body");
    if (mainSectionGridBody && mainSectionGridBody.scrollHeight > 0) { //Only when scroll mounted (scrollHeight should be > 10)
      if ((!props.isScrollToBottomDisabledRef.current) //Top to Bottom scroll only on Mount and not User @ top scroll
        || (props.previousRenderConversationsGridScrollHeightRef.current === props.conversationsGridScrollRef.current)) { //Scroll is at Bottom for updating Feed
        props.isScrollToBottomDisabledRef.current = true; //Indicate scroll has mounted
        mainSectionGridBody.scrollTop = mainSectionGridBody.scrollHeight; //note: scrollTop assigned may not be equal to scrollHeight
        props.previousRenderConversationsGridScrollHeightRef.current = mainSectionGridBody.scrollTop;
        setPreviousConversationsGridScrollRef(mainSectionGridBody.scrollTop);
      }
      else { //Scroll on re-render
        mainSectionGridBody.scrollTop = props.conversationsGridScrollRef.current; //Back to User's scroll position
      }
    }
  }

  if (!props.postsArray || props.postsArray.length < 1) {
    return (<div id={'conversations-grid-body-fail'}></div>);
  }

  function getUserFullName(pUser) {
    if (!pUser) {
      return "<user>";
    }
    return pUser.userFullName;
  }

  function getTimestampLocal(pISOTimestamp) {
    let vRowTimestamp = null;
    try {
      vRowTimestamp = moment(pISOTimestamp).utc().local().format('MM/YY hh:mm A');
    } catch (err) {
      vRowTimestamp = "";
    }
    return vRowTimestamp;
  }

  function toggleCommentsForRow(pRowID) {
    let vRowIDsToShowComments = [...props.rowIDsToShowComments];
    if (vRowIDsToShowComments.includes(pRowID)) { //Close Comments
      vRowIDsToShowComments.splice(vRowIDsToShowComments.indexOf(pRowID), 1);
    } else {
      props.processGetPostOrCommentByID(pRowID, null);
      vRowIDsToShowComments.push(pRowID); //Open Comments Box
    }
    props.setRowIDsToShowComments(vRowIDsToShowComments);
    return null;
  };

  function toggleReplyBoxForRow(pRowID) {
    let vRowIDsToShowReplyBox = [...props.rowIDsToShowReplyBox];
    if (vRowIDsToShowReplyBox.includes(pRowID)) { //Close Reply Box
      vRowIDsToShowReplyBox.splice(vRowIDsToShowReplyBox.indexOf(pRowID), 1);
    } else {
      vRowIDsToShowReplyBox.push(pRowID); //Open Reply Box
    }
    props.setRowIDsToShowReplyBox(vRowIDsToShowReplyBox);
  };

  const RenderEmoteSection = React.memo(function EmoteSectionRender(props) { //1 Emote - 1 User per (Post or Comment)
    const vPost = props.post;
    const vComment = props.comment;
    const vRowID = props.rowID;
    const vPostOrComment = vPost ?? vComment;
    let vEmotesCountFavourite = 0;
    let vEmotesCountThumbUp = 0;
    let vStyleClassName = null;
    let vEmoteIDUserVoted = null;
    if (!vPostOrComment) {
      return null;
    }
    if (vPostOrComment.emotePreviews && Object.keys(vPostOrComment.emotePreviews).length > 0) {
      for (let emotePreview of vPostOrComment.emotePreviews) {
        if (emotePreview.emote.emoticon === 'FavouriteIcon') {
          vEmotesCountFavourite = vEmotesCountFavourite + 1;
          if (emotePreview.user === userID) {
            vStyleClassName = { 'FavouriteIcon': classes.emoteFavorite_UserVoted };
            vEmoteIDUserVoted = emotePreview.emote._id;
          }
        }
        else if (emotePreview.emote.emoticon === 'ThumbUpIcon') {
          vEmotesCountThumbUp = vEmotesCountThumbUp + 1;
          if (emotePreview.user === userID) {
            vStyleClassName = { 'ThumbUpIcon': classes.emoteThumbUp_UserVoted };
            vEmoteIDUserVoted = emotePreview.emote._id;
          }
        }
      };
    };
    return (
      <div className={classes.emoteSection}>
        <div className={vStyleClassName && vStyleClassName.FavouriteIcon ? vStyleClassName.FavouriteIcon : vEmotesCountFavourite > 0 ? classes.emoteVoted : null}>
          <a
            onClick={() => {
              props.processEmotePostOrComment(
                vPost && (vPost._id ?? null),
                vComment && (vComment._id ?? null),
                vEmoteIDUserVoted ?? null,
                'FavouriteIcon',
                vRowID);
            }}>
            {vEmotesCountFavourite > 0 ? vEmotesCountFavourite : null}<FavoriteIcon />
          </a>
        </div>
        <div className={vStyleClassName && vStyleClassName.ThumbUpIcon ? vStyleClassName.ThumbUpIcon : vEmotesCountThumbUp > 0 ? classes.emoteVoted : null}>
          <a onClick={
            () => {
              props.processEmotePostOrComment(
                vPost && (vPost._id ?? null),
                vComment && (vComment._id ?? null),
                vEmoteIDUserVoted ?? null,
                'ThumbUpIcon',
                vRowID)
            }}>
            {vEmotesCountThumbUp > 0 ? vEmotesCountThumbUp : null}<ThumbUpIcon />
          </a>
        </div>
      </div>
    );
  });

  function Comment(props) {
    return (
      <div className={classes.conversationsGridNestedCellRow}>
        <AccountCircleIcon />
        <div className={classes.conversationsGridNestedCellContent}>
          <div className={classes.conversationsGridNestedCellHeader}>
            <div className={classes.conversationsGridNestedCellHeaderInner}>
              <div className={classes.conversationsGridCellHeaderInnerUser}>
                <strong>{getUserFullName(props.comment.user)}</strong>
              </div>
              <div>{getTimestampLocal(props.comment.createdAt)}</div>
            </div>
            <div className={classNames(classes.conversationsGridNestedCellOptions, classes.conversationsGridCellOptions)}>
              <RenderEmoteSection post={null} comment={props.comment} rowID={props.row._id} processEmotePostOrComment={props.processEmotePostOrComment} />
              {props.comment.user && props.comment.user._id === userID ?
                <a onClick={
                  () => {
                    postIDSelectedToDeleteRef.current = props.row._id;
                    commentIDSelectedToDeleteRef.current = props.comment._id;
                    setIsDeleteModalOpen(true);
                  }}
                >
                  <DeleteIcon />
                </a>
                :
                null
              }
            </div>
          </div>
          <div className={classes.conversationsGridNestedCellContent}>
            {props.comment.body}
          </div>
        </div>
      </div>
    )
  }

  function Post(props) {
    return (
      <div className={classes.conversationsGridPrimaryCellRow}>
        <AccountCircleIcon />
        <div className={classes.conversationsGridPrimaryCellContent}>
          <div className={classes.conversationsGridPrimaryCellHeader}>
            <div className={classes.conversationsGridPrimaryCellHeaderInner}>
              <div className={classes.conversationsGridCellHeaderInnerUser}>
                <strong>{getUserFullName(props.row.user)}</strong>
              </div>
              <div>{getTimestampLocal(props.row.createdAt)}</div>
            </div>
            <div className={classes.conversationsGridCellOptions}>
              <RenderEmoteSection post={props.row} comment={null} rowID={null} processEmotePostOrComment={props.processEmotePostOrComment} />
              {props.row.user && props.row.user._id === userID ?
                <a onClick={
                  () => {
                    postIDSelectedToDeleteRef.current = props.row._id;
                    commentIDSelectedToDeleteRef.current = null;
                    setIsDeleteModalOpen(true);
                  }}>
                  <DeleteIcon />
                </a>
                :
                null
              }
            </div>
          </div>
          <div className={classes.conversationsGridPrimaryCellBody}>
            {props.row.body}
          </div>
          <hr color='#4F4F4F' />
          {props.row.commentsCount > 0 ?
            (props.rowIDsToShowComments && props.rowIDsToShowComments.includes(props.row._id) ?
              <div className={classes.conversationsGridPrimaryCellAction}>
                <a onClick={() => toggleCommentsForRow(props.row._id)}>
                  <CommentIcon /> {'\u00A0'}{props.row.commentsCount} hide comments
                </a>
                {props.commentsCollection && props.commentsCollection[props.row._id]
                  ?
                  props.commentsCollection[props.row._id].map((comment) => (
                    <Comment key={comment._id} {...props} comment={comment} />
                  ))
                  :
                  null
                }
              </div>
              :
              <div className={classes.conversationsGridPrimaryCellAction}>
                <a onClick={
                  () => toggleCommentsForRow(props.row._id) //Retrieve Comments for Row
                }>
                  <CommentIcon /> {'\u00A0'}{props.row.commentsCount} comments
                </a>
              </div>)
            :
            null
          }
          {props.row.commentsCount > 0 ?
            <hr color='#4F4F4F' />
            :
            null
          }
          <div className={classes.conversationsGridPrimaryCellAction}>
            {props.rowIDsToShowReplyBox && props.rowIDsToShowReplyBox.includes(props.row._id) ?
              <div>
                <a onClick={() => toggleReplyBoxForRow(props.row._id)}>
                  <ReplyIcon />{'\u00A0'}close reply
                </a>
                <Editor id={"textEditor-" + props.row._id} />
                <CustomButton
                  onClick={
                    () => {
                      props.submitCreateComment('textEditor-', props.row._id, null);
                      if (!props.rowIDsToShowComments.includes(props.row._id)) {
                        toggleCommentsForRow(props.row._id);
                      }
                    }
                  }
                  color={"huddle"} size={"sm"}
                  fullWidth
                  round
                  children={"Reply"}
                />
              </div>
              :
              <a onClick={() => toggleReplyBoxForRow(props.row._id)}>
                <ReplyIcon />{'\u00A0'}reply
              </a>
            }
          </div>
        </div>
      </div>
    )
  };

  return (
    <GridItem id={'conversations-mainsection-grid-body'} className={classes.conversationsGridBody} xs={12}
      onScroll={(event) => setPreviousConversationsGridScrollRef(event.target.scrollTop)}>
      <div id={'conversations-grid-body-success'}>
        {
          props.postsArray.map((row) =>
            <Post key={row._id} {...props} row={row} />
          )
        }
        <DialogWarning
          classes={classes}
          open={isDeleteModalOpen}
          modalTitle="Delete?"
          modalDescriptionHTML={
            <p>
              Delete this {commentIDSelectedToDeleteRef.current ? 'Comment' : postIDSelectedToDeleteRef.current ? 'Post' : () => props.setIsDeleteModalOpen(false)}?
            </p>
          }
          modalActionButtonHTML={
            <CustomButton
              onClick={() =>
                props.processDeletePostOrComment(
                  commentIDSelectedToDeleteRef.current ? null : postIDSelectedToDeleteRef.current,
                  commentIDSelectedToDeleteRef.current,
                  commentIDSelectedToDeleteRef.current ? postIDSelectedToDeleteRef.current : null
                )}
              color="danger"
              simple
            >
              <DeleteIcon />
              Delete
            </CustomButton>
          }
          onCloseEvent={() => setIsDeleteModalOpen(false)}
        />
      </div >
    </GridItem>
  );
});
ConversationsGridBody.propTypes = {
  classes: PropTypes.object,
  componentDidMount: PropTypes.func,
  postsArray: PropTypes.array,
  processGetPostOrCommentByID: PropTypes.func.isRequired,
  commentsCollection: PropTypes.object,
  rowIDsToShowComments: PropTypes.array,
  setRowIDsToShowComments: PropTypes.func.isRequired,
  rowIDsToShowReplyBox: PropTypes.array,
  setRowIDsToShowReplyBox: PropTypes.func.isRequired,
  submitCreateComment: PropTypes.func.isRequired,
  processEmotePostOrComment: PropTypes.func.isRequired,
  processDeletePostOrComment: PropTypes.func.isRequired,
  isScrollToBottomDisabledRef: PropTypes.object.isRequired,
  conversationsGridScrollRef: PropTypes.object.isRequired,
  previousRenderConversationsGridScrollHeightRef: PropTypes.object.isRequired,
};
