import React, { createContext, useReducer } from 'react';
import { useHistory } from "react-router-dom";
import moment from 'moment';

import { URL } from '../AppLinks';
import { ACCESS_SESSION, LOGOUT_SESSION } from '../API/API';
export const authConstants = {
    LOCALSTORAGE_REFRESHEXPIRY: 'refreshExpiry',
    LOCALSTORAGE_ACCESSEXPIRY: 'accessExpiry',
    LOCALSTORAGE_USERID: 'userID',
    LOCALSTORAGE_USERFULLNAME: 'userFullName',
    AUTHSTATE_ACCESSED: 'ACCESSED',
    AUTHSTATE_PUBLIC_NAME: 'PUBLIC',
    AUTHSTATE_PUBLIC_VALUE: null,
    SALTESE: '$2a$12$TYX4tWcf29.agIJ9QbWpmu', //By hashing before sending, we prevent leaking the User's real password pattern they 
    //have for other websites However doesn't prevent MITM attack. If they reach this hash, user is to be instructed to reset password
};

const initialState = {
    authState: authConstants.AUTHSTATE_PUBLIC_VALUE
};
//
//Opted for JWT through TLS 1.3 & Access + Refresh tokens through HTTP-only Cookies 
//as this is the only Client that the Server will be serving.
//  Otherwise if there are third party Clients not in the same domain then 
//  would have opted for OAuth 2.0 with PKCE ('pixy')
//      OAuth sends back token in the URL but with PKCE the client provides cryptographic string
//      so even if attacker has URL string token, they won't have cryptographic string 
//
//Article 24 June 2021
//https://redislabs.com/blog/json-web-tokens-jwt-are-dangerous-for-user-sessions/
//

function InitialiseAuthState() {
    let history = useHistory();
    let refreshExpiryTimestamp = localStorage.getItem(authConstants.LOCALSTORAGE_REFRESHEXPIRY);
    let accessExpiryTimestamp = localStorage.getItem(authConstants.LOCALSTORAGE_ACCESSEXPIRY);
    if (accessExpiryTimestamp) {
        if (isLocalAccessValid()) {
            initialState.authState = authConstants.AUTHSTATE_ACCESSED;
        } else {
            window.location.replace(URL.auth);
            return null;
        };
    } else if (refreshExpiryTimestamp) {
        if (!isLocalRefreshValid) {
            history.push(URL.logout);
            return null;
        };
    };
}

function isLocalAccessValid() {
    isLocalRefreshValid();
    let accessExpiryTimestamp = localStorage.getItem(authConstants.LOCALSTORAGE_ACCESSEXPIRY);
    if (accessExpiryTimestamp) {
        accessExpiryTimestamp = moment(Date.parse(accessExpiryTimestamp));
        if (accessExpiryTimestamp.isValid() && accessExpiryTimestamp > moment()) {
            return true;
        }
    }
    return false;
}

function isLocalRefreshValid() {
    let refreshExpiryTimestamp = localStorage.getItem(authConstants.LOCALSTORAGE_REFRESHEXPIRY);
    if (refreshExpiryTimestamp) {
        refreshExpiryTimestamp = moment(Date.parse(refreshExpiryTimestamp));
        if (refreshExpiryTimestamp.isValid() && refreshExpiryTimestamp > moment()) {
            return true;
        }
    }
    return false;
}

function AuthReducer(contextState, action) { //Reducer: Switch where it receives a payload and determines the place/process for it
    switch (action.type) { //FIXME: Dispatch is currently not in-use as Auth refreshes onto another page
        default:
            return contextState;
        case authConstants.AUTHSTATE_ACCESSED:
            return {
                ...contextState, //Spread operator to access variables in contextState
                authState: authConstants.AUTHSTATE_ACCESSED
            }
        case authConstants.AUTHSTATE_PUBLIC_NAME:
            return {
                ...contextState, //Spread operator to access variables in contextState
                authState: authConstants.AUTHSTATE_PUBLIC_VALUE
            }
    }
};

const AuthContext = createContext({
    authState: authConstants.AUTHSTATE_PUBLIC_VALUE,
    userFullName: "",
    Access_Session: () => { },
    Logout: () => { },
});

function AuthProvider(props) {
    const { client } = props;
    const [contextState, dispatch] //FIXME: Dispatch is currently not in-use as Auth refreshes onto another page
        = useReducer(AuthReducer, initialState); //Upon Context update use Reducer  
    if (!(window.location.pathname === URL.auth || window.location.pathname === URL.logout)) {
        if (InitialiseAuthState() === null) { //only when not '/{%URL.auth}' or '/{%URL.logout}'
            return null; //render nothing
        }
    }
    function Access_Session(pURL_RefreshTo) {
        if (contextState.authState === authConstants.AUTHSTATE_ACCESSED && isLocalAccessValid()) {
            return null;
        }
        if (window.location.pathname !== URL.auth) {
            window.location.replace(URL.auth);
            return null;
        }
        client.query({ query: ACCESS_SESSION }).then(response => {
            if (response.data.getAccess === undefined || response.data.getAccess.status !== 'successful') {
                window.location.replace(URL.logout);
                return null;
            }
            localStorage.setItem(authConstants.LOCALSTORAGE_ACCESSEXPIRY, moment().add(20, 'm'));
            localStorage.setItem(authConstants.LOCALSTORAGE_USERID, response.data.getAccess.userID);
            localStorage.setItem(authConstants.LOCALSTORAGE_USERFULLNAME, response.data.getAccess.userFullName);
            /*dispatch({
                type: authConstants.AUTHSTATE_ACCESSED
            })*/
            const vURL_RefreshTo = pURL_RefreshTo && pURL_RefreshTo !== URL.auth ? pURL_RefreshTo : URL.dashboard;
            window.location.replace(vURL_RefreshTo);
            return null;
        });
    }
    function Logout() {
        let history = useHistory();
        localStorage.removeItem(authConstants.LOCALSTORAGE_REFRESHEXPIRY);
        localStorage.removeItem(authConstants.LOCALSTORAGE_ACCESSEXPIRY);
        localStorage.removeItem(authConstants.LOCALSTORAGE_USERID);
        localStorage.removeItem(authConstants.LOCALSTORAGE_USERFULLNAME);
        client.query({ query: LOGOUT_SESSION }).then(response => {
            if (response.data.getLogout === undefined || response.data.getLogout.status !== 'successful') {
                history.push(URL.index);
                return null;
            }
            /*dispatch({
                type: authConstants.AUTHSTATE_PUBLIC_NAME
            })*/
            window.location.replace(URL.home);
            return null;
        });
        return null;
    }
    return (
        <AuthContext.Provider
            value={{ authState: contextState.authState, 
                userID: localStorage.getItem(authConstants.LOCALSTORAGE_USERID),
                userFullName: localStorage.getItem(authConstants.LOCALSTORAGE_USERFULLNAME), 
                Access_Session, 
                Logout 
            }}
            {...props}
        />
    )
};

export { AuthContext, AuthProvider, isLocalRefreshValid, isLocalAccessValid }; //AuthProvider wrap App so it has access to AuthContext

/* Knowledge on storing info on client side
*       [https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html]
*
* Cache Storage: [non-sensitive data] [Browser varies] Cache network requests and their responses. Exposed to: window, iframe, and worker contexts. Asynchronous.
                 Able to make web application function offline when using API requests or to reduce server interaction.
* Cookies: [sensitive data] [4KB] shared with server every HTTP request same domain. Server should set session token. Client Usage: Write: document.cookie = "<cookieName> = <cookieValue>";
*          Flags: httpOnly (=> not accessible via Javascript) and SameSite=strict (or consider CORS to domain whitelist) and secure=true (=> sent over HTTPS) to increase difficulty for XSS attack.
*          CSRF mitigated using sameSite flag in your cookie and by including an anti-CSRF token
*          typically for authentication tokens, and advertising tracking. Stores as data type String.
*            Sessions stored as Sessions IDs in DB and for scalability use memcached or redis.
*               On JWT expiry, do a Session ID lookup.
*               On JWT stolen? Unless the user resets password, or contacts us, we won't know. If contacted then add Token to revoked list of tokens until expiry.
* Indexed DB: [non-sensitive data] [Browser varies. Chrome total @ 80% of disk space, Firefox @ 50%. Per Origin; 60% disk space Chrome, 2GB Firefox, 1GB Safari then prompt 200MB increments]
*             Storage Availability use: const estimatePromise = StorageManager.estimate(); //asks the Storage Manager for how much storage the current origin takes up (usage), and how much space is available (quota).
*             Involves db connection, and code transactions. Origin > DBs > Object stores > Indices. Key, Primary Key as id, Value. Can store files, blobs.
*               Alternatively could use Filesystem API (like Mega), stores data into sandboxed virtual drive within users' filesystem. To access users' filesystem you'd need them to install an extension.
* Local Storage: [non-sensitive data] [5MB~] across sessions, not shared with server. Accessible by any Javascript on page. Write/Access synchronous therefore causes browser workers blocking. Stores as data type String.
* Session Storage: [non-sensitive data] "same as Local Storage" but limited only for a Session (i.e. on tab closure)
*
* QueryString. [non-sensitive data] queryString format: /?<variableName_1>=<variableValue_2>&<variableName_2>=<variableValue_2>&<variableName_3>=<variableValue_3>...
*              Mozilla dev: <scheme>://<domainName>:<port><filePath><parameters><anchor>
*               URL format: <protocol>://<subdomain/www>.<domain>:<port>/<path>/?<queryString>#<fragment>
* Browser Extension.
* In code: HTML, CSS, Javascript files. [non-sensitive data]. Until code is changed typically on new component rerender. Easy to identify source shouldn't bother.
*
* Cookies - Bad Case
*   where browser can't share cookies with the API server (i.e. user doesn't accept to store website's cookies)
*   the API requires you to put the access token in the Authorization header
*
*/