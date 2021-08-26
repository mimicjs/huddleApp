import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { URL } from '../AppLinks';
import { AuthContext, authConstants } from '../context/auth';

function AuthRoute({ component: Component, publicAccessible, path, ...rest }) {
    let history = useHistory();
    const context = useContext(AuthContext);
    if (path !== window.location.pathname) {
        return null;
    }
    if (context.authState !== authConstants.AUTHSTATE_ACCESSED) { //Do they have access?
        if (!publicAccessible) {
            history.push(URL.index);
            //throw new Error("Force stop further code execution");
            return null;
        }
    } else if (publicAccessible) {
        history.push(URL.index);
        //throw new Error("Force stop further code execution");
        return null;
    }

    const render = <Component {...rest} />;

    //FIXME: If a Component throws an error e.g. throw new('...') then it will re-render itself again
    return (
        render !== null ? render : null
    )
};

export default AuthRoute;