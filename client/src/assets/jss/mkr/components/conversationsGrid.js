import modalStyle from "assets/jss/mkr/modalStyle";

const conversationsGridStyle = {
    ...modalStyle,
    loadingScreen: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        backgroundColor: '#242424',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'none',
    },
    loadingScreenFadeOut: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        zIndex: 0,
        transition: 'all .5s ease-in-out',
        '-moz-transition': 'all .5s ease-in-out',
        '-webkit-transition': 'all .5s  ease-in-out',
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
    conversationsGridPrimaryCellRow: {
        minWidth: 275,
        display: 'flex',
        marginTop: '15px',
        "& svg": {
            height: '50px',
            width: '50px',
        },
    },
    conversationsGridPrimaryCellContent: {
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
    conversationsGridCellHeaderInnerUser: {
        paddingRight: '8px',
    },
    conversationsGridCellOptions: {
        display: 'flex',
        float: 'right',
        paddingLeft: '0px',
        paddingRight: '0px',
        justifyContent: 'right',
        alignContent: 'center',
        flexWrap: 'wrap',
        width: '160px',
        '& svg': {
            position: 'relative',
            margin: 0,
            width: '20px',
            height: '20px',
        },
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
        wordWrap: 'nowrap',
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
    conversationsGridNestedCellHeaderInner:
    {
        flexGrow: 1,
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
        marginTop: '5px',
        width: '95%',
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
    submitButton: {
        borderRadius: '5px',
    }
}

export function ConversationsGridHeaderStyle(theme) {
    return {
        cursor: 'pointer',
        [theme.breakpoints.up("sm")]: {
            paddingBottom: '10px',
        }
    };
};


export default conversationsGridStyle;