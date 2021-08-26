import modalStyle from "assets/jss/mkr/modalStyle";

const dashboardPageStyle = {
    ...modalStyle,
    rootContainer: {
        maxHeight: '100vh',
        margin: '0 auto',
        overflow: 'hidden',
        backgroundColor: '#242424',
        color: '#e1e1e1',
        "& a": {
            cursor: 'pointer',
            color: '#8081d7',
        },
    },
    rootGrid: {
        display: 'flex',
        paddingLeft: 0,
        paddingRight: 0,
    },
    mainSection: {
        alignContent: 'start',
        paddingLeft: '20px',
        paddingRight: '40px',
        width: '100%',
        height: '100vh',
    },
    conversationsGridHeader: {
        paddingTop: '5px',
        paddingBottom: '0',
        color: '#e1e1e1',
    },
    conversationsGridBody: {
        maxHeight: 'inherit',
        overflowY: 'scroll',
        "& svg": {
            position: 'absolute',
            marginTop: '8px'
        },
    },
    conversationsGridRow: {
        minWidth: 275,
        marginTop: '15px',
        "& svg": {
            height: '50px',
            width: '50px',
        },
    },
    conversationsGridCell: {
        backgroundColor: '#373737',
        color: '#e1e1e1',
        paddingTop: '10px',
        paddingBottom: '5px',
        border: 'transparent',
        borderRadius: '10px',
        marginLeft: '60px',
        whiteSpace: 'pre-wrap',
        "& div": {
            paddingLeft: '10px',
            wordWrap: 'anywhere',
        },
        "& hr": {
            marginTop: '4px',
        },
    },
    conversationsGridCellOptions: {
        display: 'flex',
        float: 'right',
        "& div": {
            paddingLeft: '0px',
        },
        '& svg': {
            position: 'relative',
            margin: 0,
            width: '20px',
            height: '20px',
        },
    },
    emoteSection: {
        display: 'flex',
        '& a': {
            color: '#8081d74a'
        }
    },
    emoteVoted: {
        '& a': {
            color: '#8081d7'
        }
    },
    emoteFavorite_UserVoted: {
        '& a': {
            color: '#8081d7'
        },
        '& svg': {
            color: '#dd1616', //red
        }
    },
    emoteThumbUp_UserVoted: {
        '& a': {
            color: '#8081d7'
        },
        '& svg': {
            color: '#2082ff', //blue
        }
    },
    conversationsGridPrimaryCellHeader: {
        '& svg:first-child': {
            position: 'relative',
            float: 'right',
            marginTop: '1px',
            marginRight: '10px',
            width: '20px',
            height: '20px',
        }
    },
    conversationsGridPrimaryCellBody: {
        marginTop: '5px',
    },
    conversationsGridNestedCellRow_Level01: {
        padding: '5px',
        display: 'flex',
        marginTop: '10px',
        "& svg:first-child": {
            width: '30px',
            height: '30px',
        },
        "& a": {
            marginLeft: '10px'
        },
        "& a:last-child": {
            marginLeft: '20px'
        },
        "& svg:last-child": {
            width: '20px',
            height: '20px',
        },
    },
    conversationsGridNestedCellContent_Level01: {
        border: 'transparent',
        borderRadius: '3px',
        marginTop: '-5px',
        marginLeft: '10px',
    },
    conversationsGridPrimaryCellAction: {
        "& svg": {
            position: 'relative',
            marginTop: '0px',
            marginBottom: '-3px',
            height: '18px',
            width: '18px',
        }
    },
    conversationsSubmitArea: {
        marginTop: '17px',
        marginLeft: '60px',
        marginRight: '15px',
        "& div~button": {
            backgroundColor: '#8081d7',
        },
    },
    /*TextEditorConfig: { //node_modules\jodit\src\config.ts
        toolbar: false,
        presets: {},
        //toolbarButtonSize: "small",
        //buttons: ['bold', 'italic', 'underline', 'strikethrough', 'ul', 'ol', 'fullsize']
        theme: 'dark',
        minHeight: '100px',
        height: '100px',
        overflowY: 'scroll',
        '& a': {
            display: 'none'
        }
    }*/
    textFieldStyle: { //Material-UI Core TextField
        backgroundColor: '#666',
        border: 'transparent',
        borderRadius: '5px',
        width: '100%',
        padding: '12px 12px 10px 12px',
        color: "secondary",
    },
    textFieldInputStyle: { //Material-UI Core TextField
        color: "#e1e1e1",
    },
    submitButton: {
        borderRadius: '5px',
    }
}

export function ConversationsGridCellStyle(theme) {
    return {
        [theme.breakpoints.down("sm")]: {
        }
    };
};

export function ConversationsGridHeaderStyle(theme) {
    return {
        paddingBottom: '10px',
        [theme.breakpoints.down("sm")]: {
        }
    };
};

export function ConversationsGridBodyStyle(theme) {
    return {
        width: '100%',
        maxHeight: '66vh',
        [theme.breakpoints.down("sm")]: {
            maxHeight: '58vh',
            "& svg:nth-child(1)": {
                //display: 'none',
            }
        }
    };
};

export default dashboardPageStyle;