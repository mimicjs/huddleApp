const dashboardPageStyle = {
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
    submitButton: {
        borderRadius: '5px',
    }
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
        position: '-webkit-fixed',
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