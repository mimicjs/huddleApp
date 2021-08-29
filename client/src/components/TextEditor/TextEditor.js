import React from "react";
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from "@material-ui/core/styles";
import textEditorStyle from "assets/jss/mkr/components/textEditor";
//import JoditEditor from "jodit-react";

export default function TextEditor(props) {
    let useStyles = makeStyles(theme => textEditorStyle);
    let classes = useStyles();
    classes = { ...classes, ...props.classes };

    return (
        //
        //WYSWYG Editor
        //  Encountered issues (18/08/2021): 1. On re-render it leaves behind html code in html body first child layer
        //                                   2. Encapsulating styles around Editor would make it glitch for a slight second on re-render 
        //
        /*<JoditEditor
            id={props.id}
            value={props.value}
            config={{ ...props.config }}
        />*/
        //<Editor id="conversations-textEditor-createPost" config={styles.TextEditorConfig} />
        <TextField
            id={props.id}
            className={classes.textFieldStyle}
            multiline
            rows='3'
            InputProps={{ className: classes.textFieldInputStyle }}
        />
    );
}
TextEditor.propTypes = {
    classes: PropTypes.object,
};