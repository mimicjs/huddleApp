/**************************************************************************
 * CREATOR: JACKY S
 * CREATED ON: May 2021
 * BACKLOG ITEM ID: <MVP_001>
 * DESCRIPTION: User-related Database models - Mongoose <--> MongoDB
 * 
 * CHANGE HISTORY
 * =======================
 * DATE    BACKLOG ITEM   USER  DESCRIPTION 
 * 
**************************************************************************/

import { model as Imp_Mongoose_DocumentModel, Schema as Imp_Mongoose_Schema } from 'mongoose';

interface IUser {
    _id: any,
    createdAt: any,
    username: any,
//TODO: userFullName split into First Names, Surname
    userFullName: any;
    password: any,
    email: any,
//TODO: country, phone number, DoB, gender
};

//
//Back-end (Typescript). User class
//
class UserClass implements IUser{
    _id!: Imp_Mongoose_Schema.Types.ObjectId;
    createdAt!: string;
    username!: "";
    userFullName!: "";
    password!: "";
    email!: "";
    refreshToken!: "";

    constructor(
        createdAt: string,
        username: "",
        userFullName: "",
        password: "",
        email: "",
        refreshToken: "",
    ) {
        this.createdAt = createdAt;
        this.username = username;
        this.userFullName = userFullName;
        this.password = password;
        this.email = email;
        this.refreshToken = refreshToken;
    }
};

class RegisterUserClass extends UserClass { };

//To help construct Mongoose User model
const UserSchema: Imp_Mongoose_Schema = new Imp_Mongoose_Schema(
    new UserClass('', '', '', '', '', '')
);

//Mongoose Schema static and instance methods
//
//userSchema.static('sayHappy', (param) => { console.log('found me') });
//userSchema.method('saySomething', (pToken: string) => { console.log('userSchema.method: param: ' + pToken); console.log('userSchema.method: userSchema'); console.log(userSchema); });

//
//Database connection interaction. Mongoose User model.
//
const UserSchema_Model = Imp_Mongoose_DocumentModel('User', UserSchema, 'users'); //Mongoose model

export const User = {
    RegisterUserClass: new RegisterUserClass('', '', '', '', '', ''),
    UserClass: new UserClass('', '', '', '', '', ''),
    UserSchema_Model
};