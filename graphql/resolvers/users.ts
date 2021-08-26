/**************************************************************************
 * CREATOR: JACKY S
 * CREATED ON: May 2021
 * BACKLOG ITEM ID: <MVP_001>
 * DESCRIPTION: Resolver for User-related queries
 * 
 * CHANGE HISTORY
 * =======================
 * DATE    BACKLOG ITEM   USER  DESCRIPTION 
 * 
**************************************************************************/

import { ApolloError as Imp_ApolloError, UserInputError as Imp_UserInputError, AuthenticationError as Imp_AuthenticationError } from 'apollo-server-errors';
import * as Imp_jwt from 'jsonwebtoken';
import moment from 'moment';

import { validators as Imp_validators } from '../../util/validators';
import { signToken as Imp_signToken, verifyToken as Imp_verifyToken } from '../../config';
import { User as Imp_User } from '../../models/User';
import { objectHelper as Imp_objectHelper } from './../../util/objectHelper';
import { bcryptHash as Imp_bcryptHash } from '../../config';

const Query = {
    getAccess: async (_: '', body: {}, context: { [key: string]: any }): Promise<any> => {
        try {
            console.log('getAccess triggered');
            const vCookieRefreshValue = Imp_objectHelper.retrieveCookieValue(context, 'refresh');
            if (Imp_objectHelper.isNullOrEmpty(vCookieRefreshValue)) {
                throw ('Unable to retrieve cookie');
            }
            const vCookieRefreshDecoded = Imp_jwt.decode(vCookieRefreshValue); //JWT Token: Decoded
            if (Imp_objectHelper.isNullOrEmpty(vCookieRefreshDecoded) //JWT Token Validation: Decoded successfully
                || !(vCookieRefreshDecoded instanceof Object)) { //JWT Token Validation: In form of an Object
                throw ('Unable to decode Refresh cookie');
            }
            else if ((!Imp_objectHelper.hasOwnProperty(vCookieRefreshDecoded, '_id')
                || (Imp_objectHelper.isNullOrEmpty(vCookieRefreshDecoded._id)))
                && ((!Imp_objectHelper.hasOwnProperty(vCookieRefreshDecoded, 'userFullName')
                    || (Imp_objectHelper.isNullOrEmpty(vCookieRefreshDecoded.userFullName))))) { //JWT Token: Includes username
                throw ('Unable to identify _id or userFullName within decoded refresh cookie');
            };
            const vVerifyResponse = await Imp_verifyToken(vCookieRefreshValue, 'refresh');
            if (!vVerifyResponse) {
                throw ('Verification of Refresh cookie has failed');
            };
            const vCookieAccessName = "access";
            const vCookieAccessToken_New = Imp_signToken(vVerifyResponse, vCookieAccessName);
            if (!vCookieAccessToken_New) {
                throw ('Unable to sign new Access token');
            }
            //Only set-cookie when DB accepts the request token
            context.setCookies.push({
                name: vCookieAccessName, //If they've got hold of Access token then authorised until expiry. However if Refresh then authorised until logout or re-login.
                //value: Imp_signToken(vAuthenticated_User),
                value: vCookieAccessToken_New,
                options: {
                    //domain: "",
                    expires: moment().add(20, 'm').toDate(), //UTC. Note: Attacker window 20 minutes (assuming Client responsibility on device is insecure)
                    httpOnly: true, //If set to true, only shows up on browser's cookie list @ localhost (won't even show for PC-name:port or external)
                    //maxAge: 20,
                    //path: "/",
                    //sameSite: true,
                    secure: true
                }
            });
            return {
                status: "successful",
                userID: vCookieRefreshDecoded._id,
                userFullName: vCookieRefreshDecoded.userFullName
            }
        } catch (err) {
            console.log(err);
            //Only set-cookie when DB accepts the request token
            const vCookieRefreshName = 'refresh';
            context.setCookies.push({ //Revoke their Refresh token, request Credentials again
                name: vCookieRefreshName,
                value: 'expired',
                options: {
                    expires: moment().add(-1, 'y').toDate(),
                    httpOnly: true,
                    path: "/auth",
                    secure: true
                }
            });
            return { status: 'unsuccessful' };
        }
    },
    getLogout: async (_: '', body: {}, context: { [key: string]: any }): Promise<any> => {
        try {
            console.log('getLogout triggered');
            const vCookieRefreshName = 'refresh';
            const vCookieRefreshValue = Imp_objectHelper.retrieveCookieValue(context, vCookieRefreshName);
            const vCookieAccessName = 'access';
            const vCookieAccessValue = Imp_objectHelper.retrieveCookieValue(context, vCookieAccessName);
            //Only set-cookie when DB accepts the request token
            context.setCookies.push({
                name: vCookieRefreshName,
                value: 'expired',
                options: {
                    expires: moment().add(-1, 'y').toDate(),
                    httpOnly: true,
                    path: "/auth",
                    secure: true
                }
            });
            //Due to ApolloServer limitations only 1 set-cookie
            /*if (vCookieAccessValue) {
                context.setCookies.push({
                    name: vCookieAccessName,
                    value: 'expired',
                    options: {
                        expires: moment().add(-1, 'y').toDate(),
                        httpOnly: true,
                        secure: true
                    }
                })
            };*/
            //
            //TODO: REDIS DB: hold invalidated: Refresh Token and Access Token in order to refuse access  
            //
            return {
                status: "successful"
            }
        } catch (err) {
            console.log(err);
            const vCookieRefreshName = 'refresh'; //In any case, just remove Refresh token
            context.setCookies.push({
                name: vCookieRefreshName,
                value: 'expired',
                options: {
                    expires: moment().add(-1, 'y').toDate(),
                    httpOnly: true,
                    path: "/auth",
                    secure: true
                }
            });
            return { status: 'unsuccessful' };
        }
    }
}

const Mutation = {
    login: async (_: '', userLoginAttempt: typeof Imp_User.UserClass, context: { [key: string]: any }): Promise<any> => {
        try {
            const {
                vErrors: pErrors,
                vDB_User: vAuthenticated_User,
                vIsLoginValid: vIsLoginValid
            } = await Imp_validators.validateLoginInput(userLoginAttempt);
            if (!vIsLoginValid) {
                throw new Imp_UserInputError('Errors', { pErrors })
            }
            vAuthenticated_User.password = null;
            const vCookieRefreshName = 'refresh';
            const vCookieRefreshValue = Imp_signToken(vAuthenticated_User, vCookieRefreshName);
            if (!vCookieRefreshValue) {
                return { status: 'unsuccessful' };
            }
            const vCookieRefreshValue_Hashed = await Imp_bcryptHash(vCookieRefreshValue, 99);
            const vDB_Response = await Imp_User.UserSchema_Model.updateOne(
                { username: vAuthenticated_User.username },
                { refreshToken: vCookieRefreshValue_Hashed },
                { lean: true }
            );
            if (vDB_Response.nModified < 1) { //nModified is mongoose attribute
                return { status: 'unsuccessful' };
            }
            context.setCookies.push({ //Refresh token to provide new Access token. Mitigates man-in-the-middle attacks.
                name: vCookieRefreshName,      //If they've got hold of Access token then authorised until expiry
                value: vCookieRefreshValue,
                options: {
                    //domain: "",
                    expires: moment().add(2, 'd').toDate(),
                    httpOnly: true, //If set to true, only shows up on browser's cookie list @ localhost (won't even show for PC-name:port or external)
                    //maxAge: 20, //If Refresh token stolen then authorised until logout or re-login
                    path: "/auth",
                    //sameSite: true,
                    secure: true
                }
            });
            return {
                status: "successful"
            }
        } catch (err) {
            console.log(err);
            return { status: "unsuccessful" }
        }
    },
    register: async (_: '',
        body: {
            registerInput: typeof Imp_User.RegisterUserClass
        }, context: '', info: ''): Promise<any> => {
        try {
            const vRegisterInput = body.registerInput;
            const { vErrors, vValid: vIsRegisterValid } = await Imp_validators.validateRegisterInput(vRegisterInput);
            if (!vIsRegisterValid) {
                throw new Imp_UserInputError('Errors', { vErrors });
            }
            const vPassword = await Imp_bcryptHash(vRegisterInput.password, 99);
            if (!vPassword) {
                throw new Imp_AuthenticationError('Password is empty');
            }
            const vNewUser = new Imp_User.UserSchema_Model(
                {
                    email: vRegisterInput.email,
                    username: vRegisterInput.username,
                    userFullName: vRegisterInput.userFullName,
                    password: vPassword,
                    createdAt: new Date().toISOString(),
                }
            );
            let vNewUserCreated = await vNewUser.save();
            if (!vNewUserCreated) {
                throw new Imp_ApolloError("Internal Server error");
            };
            vNewUserCreated.set({ vPassword: null });
            return { status: "successful" };
        } catch (err) {
            console.log(err);
            return err;
        }
    }
};

export const users = {
    Mutation,
    Query
};