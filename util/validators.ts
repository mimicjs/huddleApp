/**************************************************************************
 * CREATOR: JACKY S
 * CREATED ON: May 2021
 * BACKLOG ITEM ID: <MVP_001>
 * DESCRIPTION: Validations
 * 
 * CHANGE HISTORY
 * =======================
 * DATE    BACKLOG ITEM   USER  DESCRIPTION 
 * 
**************************************************************************/

import { ApolloError } from 'apollo-server-errors';
import * as Imp_bcrypt from 'bcryptjs';
import { User as Imp_User } from '../models/User';
import { objectHelper as Imp_Helper_objectHelper } from '../util/objectHelper';

const Validators = {
    validateLoginInput: async (pUserLoginAttempt: typeof Imp_User.UserClass): Promise<any> => {
        try {
            const vErrors: { [key: string]: any } = {};
            if (Imp_Helper_objectHelper.isNullOrEmpty(pUserLoginAttempt.username.trim())) {
                vErrors.username = 'Username cannot be empty';
            }
            if (Imp_Helper_objectHelper.isNullOrEmpty(pUserLoginAttempt.password.trim())) {
                vErrors.password = 'Password cannot be empty';
                return { vErrors, vIsLoginValid: false };
            }
            const vErrorMessage_UserMismatch = 'Credentials are incorrect';
            const vDB_User = await Imp_User.UserSchema_Model.findOne({ username: pUserLoginAttempt.username }, {}, { lean: true }) as typeof Imp_User.UserClass;
            if (Imp_Helper_objectHelper.isNullOrEmpty(vDB_User) || Imp_Helper_objectHelper.isNullOrEmpty(vDB_User.password)) {
                vErrors.general = vErrorMessage_UserMismatch;
                return { vErrors, vIsLoginValid: false };
            }
            //FIXME: 2FA or Multi-Factor security validation
            const vIsMatchingPassword: boolean = await Imp_bcrypt.compare(pUserLoginAttempt.password, vDB_User.password); //Compare encrypted passwords for User authentication
            if (!vIsMatchingPassword) {
                vErrors.general = vErrorMessage_UserMismatch; //Wrong Credentials but don't want them to know username is correct, security risk
            }
            return {
                vErrors,
                vDB_User,
                vIsLoginValid: Object.keys(vErrors).length < 1
            }
        } catch (err) {
            const vErrors: { [key: string]: any } = {};
            vErrors.general = 'Validation failed';
            return {
                vErrors,
                vIsLoginValid: false
            }
        }
    },

    validateRegisterInput:
        async (
            pRegisterInput: typeof Imp_User.RegisterUserClass
        ): Promise<any> => {
            try {
                const vErrors: { [key: string]: any } = {};
                if (Imp_Helper_objectHelper.isNullOrEmpty(pRegisterInput.username.trim())) {
                    vErrors.username = 'Username cannot be empty';
                }
                if (Imp_Helper_objectHelper.isNullOrEmpty(pRegisterInput.userFullName.trim())) {
                    vErrors.userFullName = "Fullname cannot be empty";
                }
                if (Imp_Helper_objectHelper.isNullOrEmpty(pRegisterInput.email.trim())) {
                    vErrors.email = 'Email cannot be empty';
                } else {
                    const vErrorMessage_email = Imp_Helper_objectHelper.isValidEmailAddress(pRegisterInput.email);
                    if (!(Imp_Helper_objectHelper.isNullOrEmpty(vErrorMessage_email))) {
                        vErrors.email = vErrorMessage_email;
                    }
                }
                if (Imp_Helper_objectHelper.isNullOrEmpty(pRegisterInput.password) || Imp_Helper_objectHelper.isNullOrEmpty(pRegisterInput.password)) {
                    vErrors.password = 'Password cannot be empty';
                }
                if (!(Imp_Helper_objectHelper.isNullOrEmpty(vErrors))) {
                    return {
                        vErrors,
                        vValid: Object.keys(vErrors).length < 1
                    }
                }
                const vExistingUser = await Imp_User.UserSchema_Model.findOne({ username: pRegisterInput.username }, {}, { lean: true });
                if (!(Imp_Helper_objectHelper.isNullOrEmpty(vExistingUser))) {
                    vErrors.username = 'Your username has been taken, try an alternative';
                }
                return {
                    vErrors,
                    vValid: Object.keys(vErrors).length < 1
                }
            } catch (err) {
                console.log(err);
                const vErrors: { [key: string]: any } = {};
                vErrors.general = 'Validation failed';
                return {
                    vErrors,
                    vValid: false
                }
            }
        },

    validateEmotePostOrComment:
        async (
            pEmoticon_UserInput: string | undefined
        ): Promise<any> => {
            try {
                if (!pEmoticon_UserInput) {
                    throw new Error('pEmoticon_UserInput is null');
                }
                pEmoticon_UserInput = pEmoticon_UserInput.toString();
                const vEmojiList = [ //FIXME: Standard for identifying emojis
                    'ThumbUpIcon',
                    'FavouriteIcon'
                ];
                return {
                    vValid: (vEmojiList.includes(pEmoticon_UserInput))
                };
            } catch (err) {
                console.log(err);
                const vErrors: { [key: string]: any } = {};
                vErrors.general = 'Validation failed';
                return {
                    vErrors,
                    vValid: false
                }
            }
        }

};

export const validators = Validators;