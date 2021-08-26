import React, { useEffect, useState, useRef, useContext } from 'react';
import { AuthContext } from '../../../context/auth';
import moment from 'moment';
import { FixedSizeList as List } from 'react-window';

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

export function ConversationsGridHeader(props) {
  const classes = props.classes;
  return (
    <div className={classes.conversationsGridHeader}>
      <h4><PublicIcon /><b> General</b></h4>
      <hr />
    </div>
  );
};

export const ConversationsGridBody = React.memo(function ConversationsGridBodyRender(props) {
  const classes = props.classes;
  const postIDSelectedToDelete = useRef("");
  const commentIDSelectedToDelete = useRef("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  if (!isDeleteModalOpen) {
    postIDSelectedToDelete.current = "";
    commentIDSelectedToDelete.current = "";
  }

  const { userID } = useContext(AuthContext);

  const previousConversationsGridEndRef = useRef(0);
  useEffect(() => {
    const mainSectionGridBody = document.getElementById("conversations-mainsection-grid-body");
    if (mainSectionGridBody) {
      if (mainSectionGridBody.scrollTop >= previousConversationsGridEndRef.current) {
        console.log('mainSectionGridBody.scrollHeight >= previousConversationsGridEndRef.current')
        console.log('previousConversationsGridEndRef.current: ' + previousConversationsGridEndRef.current)
        console.log('mainSectionGridBody.scrollTop: ' + mainSectionGridBody.scrollTop);
        console.log('mainSectionGridBody.scrollHeight: ' + mainSectionGridBody.scrollHeight);
        mainSectionGridBody.scrollTop = mainSectionGridBody.scrollHeight;
        previousConversationsGridEndRef.current = mainSectionGridBody.scrollTop;
      }
    }
    props.componentDidMount();
  });

  if (!props.dataArray || props.dataArray.length < 1) {
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

  function RenderEmoteSection(pPost, pComment, pRowID) { //1 Emote - 1 User per (Post or Comment)
    const vPostOrComment = pPost ?? pComment;
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
                pPost && (pPost._id ?? null),
                pComment && (pComment._id ?? null),
                vEmoteIDUserVoted ?? null,
                'FavouriteIcon',
                pRowID);
            }}>
            {vEmotesCountFavourite > 0 ? vEmotesCountFavourite : null}<FavoriteIcon />
          </a>
        </div>
        <div className={vStyleClassName && vStyleClassName.ThumbUpIcon ? vStyleClassName.ThumbUpIcon : vEmotesCountThumbUp > 0 ? classes.emoteVoted : null}>
          <a onClick={
            () => {
              props.processEmotePostOrComment(
                pPost && (pPost._id ?? null),
                pComment && (pComment._id ?? null),
                vEmoteIDUserVoted ?? null,
                'ThumbUpIcon',
                pRowID)
            }}>
            {vEmotesCountThumbUp > 0 ? vEmotesCountThumbUp : null}<ThumbUpIcon />
          </a>
        </div>
      </div>
    );
  };

  return (
    <div id={'conversations-grid-body-success'}>
      {/* https://staleclosures.dev/preventing-list-rerenders/ 
      https://react-window.vercel.app/#/examples/list/fixed-size*/}
      {props.dataArray.map((row) => (
        <List
          height={150}
          itemCount={1000}
          itemSize={35}
          width={300}
          key={row._id} className={classes.conversationsGridRow}>
          <div >
            <AccountCircleIcon />
            <div className={classes.conversationsGridCell}>
              <div className={classes.conversationsGridPrimaryCellHeader}>
                <strong>{getUserFullName(row.user)}</strong>{'\u00A0'}
                {getTimestampLocal(row.createdAt)}
                <div className={classes.conversationsGridCellOptions}>
                  {RenderEmoteSection(row, null, null)}
                  {row.user && row.user._id === userID ?
                    <a onClick={
                      () => {
                        postIDSelectedToDelete.current = row._id;
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
                {row.body}
              </div>
              <hr color='#4F4F4F' />
              {row.commentsCount > 0 ?
                (props.rowIDsToShowComments && props.rowIDsToShowComments.includes(row._id) ?
                  <div className={classes.conversationsGridPrimaryCellAction}>
                    <a onClick={() => toggleCommentsForRow(row._id)}>
                      <CommentIcon /> {'\u00A0'}{row.commentsCount} hide comments
                    </a>
                    {props.commentsCollection[row._id]
                      ?
                      props.commentsCollection[row._id].map((comment) => (
                        <div key={comment._id} className={classes.conversationsGridNestedCellRow_Level01}>
                          <AccountCircleIcon />
                          <div className={classes.conversationsGridNestedCellContent_Level01}>
                            <strong>{getUserFullName(comment.user)}</strong> {'\u00A0'}{getTimestampLocal(comment.createdAt)}<br />
                            {comment.body}
                          </div>
                          <div className={classes.conversationsGridCellOptions}>
                            {RenderEmoteSection(null, comment, row._id)}
                            {comment.user && comment.user._id === userID ?
                              <a onClick={
                                () => {
                                  postIDSelectedToDelete.current = row._id;
                                  commentIDSelectedToDelete.current = comment._id;
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
                      ))
                      :
                      null
                    }
                  </div>
                  :
                  <div className={classes.conversationsGridPrimaryCellAction}>
                    <a onClick={
                      () => toggleCommentsForRow(row._id) //Retrieve Comments for Row
                    }>
                      <CommentIcon /> {'\u00A0'}{row.commentsCount} comments
                    </a>
                  </div>)
                :
                null
              }
              {row.commentsCount > 0 ?
                <hr color='#4F4F4F' />
                :
                null
              }
              <div className={classes.conversationsGridPrimaryCellAction}>
                {props.rowIDsToShowReplyBox && props.rowIDsToShowReplyBox.includes(row._id) ?
                  <div>
                    <a onClick={() => toggleReplyBoxForRow(row._id)}>
                      <ReplyIcon />{'\u00A0'}close reply
                    </a>
                    <Editor id={"textEditor-" + row._id} style={props.textFieldStyle} inputStyle={props.textFieldInputStyle} />
                    <CustomButton
                      onClick={
                        () => {
                          props.submitCreateComment('textEditor-', row._id, null);
                          if (!props.rowIDsToShowComments.includes(row._id)) {
                            toggleCommentsForRow(row._id);
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
                  <a onClick={() => toggleReplyBoxForRow(row._id)}>
                    <ReplyIcon />{'\u00A0'}reply
                  </a>
                }
              </div>
            </div>
          </div>
        </List>
      ))}
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

function DialogDeletePostOrComment(props) {
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
}