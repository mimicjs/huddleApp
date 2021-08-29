import React from 'react';
import PropTypes from 'prop-types';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import Slide from "@material-ui/core/Slide";
import Close from "@material-ui/icons/Close";

import { makeStyles } from "@material-ui/core/styles";
import modalStyle from "assets/jss/mkr/modalStyle";

export const DialogWarning = React.memo(function DialogWarningRender(props) {
    let useStyles = makeStyles(theme => modalStyle);
    let classes = useStyles();
    if (!props.open) {
        return null;
    }
    classes = { ...classes, ...props.classes };

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
            open={props.open}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => props.onCloseEvent()}
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
                    onClick={() => props.onCloseEvent()}
                >
                    <Close className={classes.modalClose} />
                </IconButton>
                <h4 className={classes.modalTitle}>{props.modalTitle}</h4>
            </DialogTitle>
            <DialogContent id="classic-modal-slide-description" className={classes.modalBody}>
                {props.modalDescriptionHTML}
            </DialogContent>
            <DialogActions className={classes.modalFooter}>
                {props.modalActionButtonHTML}
            </DialogActions>
        </Dialog>
    )
});
DialogWarning.propTypes = {
    classes: PropTypes.object,
    open: PropTypes.bool.isRequired,
    modalTitle: PropTypes.string.isRequired,
    modalDescriptionHTML: PropTypes.object.isRequired,
    modalActionButtonHTML: PropTypes.object.isRequired,
    onCloseEvent: PropTypes.func.isRequired,
};