import React, { useLayoutEffect, useState, useRef, useContext } from 'react';
import { AuthContext } from '../../../context/auth';
import moment from 'moment';
import classNames from 'classnames';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import Slide from "@material-ui/core/Slide";

import Editor from '../../../components/TextEditor/TextEditor';
import CustomButton from "../../../components/CustomButtons/Button";

import PublicIcon from '@material-ui/icons/Public';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import CommentIcon from '@material-ui/icons/Comment';
import ReplyIcon from '@material-ui/icons/Reply';
import Close from "@material-ui/icons/Close";

import FavoriteIcon from '@material-ui/icons/Favorite';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import DeleteIcon from '@material-ui/icons/Delete';

export const ConversationsGridHeader = React.memo(function RenderConversationsGridHeader(props) {
  const classes = props.classes;
  return (
    <div className={classes.conversationsGridHeader}>
      <h4><PublicIcon /><b> General</b></h4>
      <hr />
    </div>
  );
});

const DialogDeletePostOrComment = React.memo(function DialogDeletePostOrCommentRender(props) {
  if (!props.open) {
    return null;
  }
  const classes = props.classes;
  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
  });
  Transition.displayName = "Transition";
  return (
    <Dialog
      classes={{
        root: classes.center,
        paper: classes.modal,
      }}
      open={true}
      TransitionComponent={Transition}
      keepMounted
      onClose={() => props.setIsDeleteModalOpen(false)}
      aria-labelledby="classic-modal-slide-title"
      aria-describedby="classic-modal-slide-description"
    >
      <DialogTitle
        id="classic-modal-slide-title"
        disableTypography
        className={classes.modalHeader}
      >
        <IconButton
          className={classes.modalCloseButton}
          key="close"
          aria-label="Close"
          color="inherit"
          onClick={() => props.setIsDeleteModalOpen(false)}
        >
          <Close className={classes.modalClose} />
        </IconButton>
        <h4 className={classes.modalTitle}>Delete?</h4>
      </DialogTitle>
      <DialogContent
        id="classic-modal-slide-description"
        className={classes.modalBody}
      >
        <p>
          Delete this {props.commentID ? 'Comment' : props.postID ? 'Post' : () => props.setIsDeleteModalOpen(false)}?
        </p>
      </DialogContent>
      <DialogActions className={classes.modalFooter}>
        <CustomButton
          onClick={() =>
            props.processDeletePostOrComment(
              props.commentID ? null : props.postID,
              props.commentID,
              props.commentID ? props.postID : null
            )}
          color="danger"
          simple
        >
          <DeleteIcon />
          Delete
        </CustomButton>
      </DialogActions>
    </Dialog>
  )
});

export const ConversationsGridBody = React.memo(function ConversationsGridBodyRender(props) {
  const { userID } = useContext(AuthContext);
  const classes = props.classes;
  const postIDSelectedToDelete = useRef("");
  const commentIDSelectedToDelete = useRef("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  if (!isDeleteModalOpen) {
    postIDSelectedToDelete.current = "";
    commentIDSelectedToDelete.current = "";
  }

  useLayoutEffect(() => {
    props.componentDidMount();
  });

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
          <a onClick={
            () => {
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
            <div>
              <strong>{getUserFullName(props.comment.user)}</strong>
              {'\u00A0'}{getTimestampLocal(props.comment.createdAt)}
            </div>
            <div className={classNames(classes.conversationsGridNestedCellOptions, classes.conversationsGridCellOptions)}>
              <RenderEmoteSection post={null} comment={props.comment} rowID={props.row._id} processEmotePostOrComment={props.processEmotePostOrComment} />
              {props.comment.user && props.comment.user._id === userID ?
                <a onClick={
                  () => {
                    postIDSelectedToDelete.current = props.row._id;
                    commentIDSelectedToDelete.current = props.comment._id;
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
      <div className={classes.conversationsGridRow}>
        <AccountCircleIcon />
        <div className={classes.conversationsGridCell}>
          <div className={classes.conversationsGridPrimaryCellHeader}>
            <div className={classes.conversationsGridPrimaryCellHeaderInner}>
              <strong>{getUserFullName(props.row.user)}</strong>{'\u00A0'}
              {getTimestampLocal(props.row.createdAt)}
            </div>
            <div className={classes.conversationsGridCellOptions}>
              <RenderEmoteSection post={props.row} comment={null} rowID={null} processEmotePostOrComment={props.processEmotePostOrComment} />
              {props.row.user && props.row.user._id === userID ?
                <a onClick={
                  () => {
                    postIDSelectedToDelete.current = props.row._id;
                    commentIDSelectedToDelete.current = null;
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
              <div className={classes.textFieldSectionStyle}>
                <a onClick={() => toggleReplyBoxForRow(props.row._id)}>
                  <ReplyIcon />{'\u00A0'}close reply
                </a>
                <Editor id={"textEditor-" + props.row._id} style={props.textFieldStyle} inputStyle={props.textFieldInputStyle} />
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
    <div id={'conversations-grid-body-success'}>
      {
        props.postsArray.map((row) =>
          <Post key={row._id} {...props} row={row} />
        )
      }
      <DialogDeletePostOrComment
        classes={classes}
        open={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        processDeletePostOrComment={props.processDeletePostOrComment}
        postID={postIDSelectedToDelete.current}
        commentID={commentIDSelectedToDelete.current}
      />
    </div >
  );
});
