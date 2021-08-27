import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
//import JoditEditor from "jodit-react";

export default function Editor(props) {

    const useStyles = makeStyles((theme) => ({
        inputStyle: props.inputStyle,
    }));

    const classes = useStyles();

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
            style={props.style}
            multiline
            rows='3'
            InputProps={{ className: classes.inputStyle }}
        />
    );
}