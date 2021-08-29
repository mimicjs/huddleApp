const barMenusStyle = {
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
    appBar: {
        position: 'sticky',
        backgroundColor: '#464776',
        minHeight: '65px',
        maxHeight: '65px',
    },
    dropdownLink: {
    },
    taskNavbar: {
        height: '100vh',
        backgroundColor: '#242424',
        minHeight: 'unset',
    },
    taskNavbarListItem: {
        marginLeft: '-10px',
    },
    channelBar: {
        '& >div': {
            backgroundColor: '#242424',
            color: '#e1e1e1',
            borderColor: '#e1e1e1'
        },
        '& li': {
            cursor: 'pointer',
        }
    }
}

export function taskNavbarStyleBase(theme) {
    return {
        width: '70px',
        [theme.breakpoints.down("sm")]: {
            display: "none",
        }
    }
};

export function channelBarStyleBase(theme) {
    return {
        position: 'inherit',
        width: 0,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        [theme.breakpoints.down("sm")]: {
            borderColor: '#242424'
        }
    }
};

export function channelBarStyleClosed(theme) {
    return {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: '270px',
    }
};

export default barMenusStyle;