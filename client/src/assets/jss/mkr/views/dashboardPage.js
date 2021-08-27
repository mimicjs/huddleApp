import modalStyle from "assets/jss/mkr/modalStyle";

const dashboardPageStyle = {
    ...modalStyle,
    rootContainer: {
        width: '100vw',
        height: '100vh',
        position: 'relative',
        maxHeight: '100vh',
        maxWidth: '100vw',
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
    conversationsGridHeader: {
        paddingTop: '5px',
        paddingBottom: '0',
        color: '#e1e1e1',
    },
    conversationsGridBody: {
        maxHeight: 'inherit',
        overflowY: 'scroll',
    },
    conversationsGridRow: {
        minWidth: 275,
        display: 'flex',
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
        width: '100%',
        whiteSpace: 'pre-wrap',
        paddingLeft: '10px',
        paddingRight: '10px',
        wordWrap: 'anywhere',
        "& hr": {
            marginTop: '4px',
        },
    },
    conversationsGridCellOptions: {
        display: 'flex',
        float: 'right',
        paddingLeft: '0px',
        paddingRight: '0px',
        justifyContent: 'right',
        flexWrap: 'wrap',
        width: '160px',
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
    conversationsGridPrimaryCellHeaderInner: {
        display: 'inline-flex',
    },
    conversationsGridPrimaryCellBody: {
        marginTop: '5px',
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
    conversationsGridNestedCellHeader:
    {
        display: 'flex',
    },
    conversationsGridNestedCellRow: {
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
        "& svg:last-child": {
            width: '20px',
            height: '20px',
        },
    },
    conversationsGridNestedCellContent: {
        border: 'transparent',
        borderRadius: '3px',
        marginTop: '-5px',
    },
    conversationsGridNestedCellContent: {
        marginTop: '-2px',
    },
    textFieldSectionStyle: { //Material-UI Core TextField
    },
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
}

export function ConversationsGridStyle(theme) {
    return {
        width: '100%',
        paddingRight: '0px',
        paddingLeft: '0px',
        "& div>svg:first-child": {
            display: 'none',
        },
        [theme.breakpoints.up("sm")]: {
            alignContent: 'start',
            paddingLeft: '20px',
            paddingRight: '40px',
            width: '100%',
            height: '100vh',
            "& div>svg:first-child": {
                marginRight: '10px',
                display: 'inline-grid',
            },
        }
    };
};

export function ConversationsGridHeaderStyle(theme) {
    return {
        [theme.breakpoints.up("sm")]: {
            paddingBottom: '10px',
        }
    };
};

export function ConversationsGridBodyStyle(theme) {
    return {
        maxHeight: '60vh',
        [theme.breakpoints.up("md")]: {
            maxHeight: '64vh',
        },
        [theme.breakpoints.up("xl")]: {
            maxHeight: '66vh',
        }
    }
};

export function ConversationsGridTextEditorAreaStyle(theme) {
    return {
        position: '-webkit-sticky',
        position: 'sticky',
        bottom: '0',
        paddingLeft: '15px',
        paddingRight: '15px',
        paddingBottom: '17px',
        marginTop: '17px',
        [theme.breakpoints.up("sm")]: {
            paddingLeft: '75px',
            "& div~button": {
                backgroundColor: '#8081d7',
            },
        }
    };
};
export default dashboardPageStyle;