/**************************************************************************
 * CREATOR: JACKY S
 * CREATED ON: May 2021
 * BACKLOG ITEM ID: <MVP_001>
 * DESCRIPTION: Authentication & Authorisation
 * 
 * CHANGE HISTORY
 * =======================
 * DATE    BACKLOG ITEM   USER  DESCRIPTION 
 * 
**************************************************************************/

import { AuthenticationError as Imp_AuthenticationError } from 'apollo-server-express';

import { User as Imp_User } from '../models/User';
import { verifyToken as Imp_verifyToken } from '../config';
import { objectHelper as Imp_objectHelper } from '../util/objectHelper';

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

const Auth = {
    authChecker: async (context: { [key: string]: any }): Promise<typeof Imp_User.UserClass> => {
        const vCookieAccessValue = Imp_objectHelper.retrieveCookieValue(context, 'access');
        if (vCookieAccessValue) {
            try {
                //FIXME: Suggestions:
                //0. Change in User-Agent (browser)
                //1. Geolocation lookup, save location in JWT Access Token Payload and validate against Client's IP (counter: VPN)
                //2. REDIS lookup for Revoked Access tokens or in memory (Only when they logout and send us their accessToken, can't deal with browser close)
                //3. Bot pattern behaviour
                //4. IP block
                const vUser = await Imp_verifyToken(vCookieAccessValue, 'access');
                if(Imp_objectHelper.isNullOrEmpty(vUser)
                || !(vUser instanceof Object)){
                    throw new Imp_AuthenticationError('User is not type User');
                }
                const vAuthenticated_User: typeof Imp_User.UserClass = vUser;
                return vAuthenticated_User;
            } catch (err) {
                throw new Imp_AuthenticationError('Invalid/Expired token');
            }
        }
        throw new Imp_AuthenticationError('Context Access cookie must be provided');
    }
}

export const auth = Auth;