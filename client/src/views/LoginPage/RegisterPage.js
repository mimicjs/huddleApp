import React, { useEffect, useState } from 'react';
import { Link, useHistory } from "react-router-dom"; // react components for routing our app without refresh
import { useMutation } from '@apollo/react-hooks';
import bcryptjs from 'bcryptjs';

import { URL } from '../../AppLinks';
import { REGISTER_USER } from '../../API/API';
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { InputAdornment, Icon } from "@material-ui/core";
// @material-ui/icons
import { AccountBox, Email, People } from "@material-ui/icons";
// core components
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import CardFooter from "components/Card/CardFooter";
import CustomInput from "components/CustomInput/CustomInput";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Header from "components/Header/Header";
import HeaderLinks from "components/Header/HeaderLinks";
import Footer from "components/Footer/Footer";
import Button from "components/CustomButtons/Button";

import styles from "assets/jss/mkr/views/registerPage";

import image from "assets/img/bg7.jpg"; //https://unsplash.com/photos/F7HGqkkMYAU
import { authConstants } from '../../context/auth';

const useStyles = makeStyles(styles);

export default function RegisterPage(props) {
    let history = useHistory();
    const [cardAnimaton, setCardAnimation] = useState("cardHidden");
    setTimeout(function () {
        setCardAnimation("");
    }, 700);
    const classes = useStyles();
    const { ...rest } = props;

    const formRegisterValuesDefault = {
        Username: '',
        FullName: '',
        Email: '',
        Password: '',
        ConfirmPassword: ''
    };
    const [registerFormValues, setRegisterFormValues] = useState(formRegisterValuesDefault); //mutable
    const [submissionsCount, setSubmissionsCount] = useState(0);
    const [registerFormErrors, setRegisterFormErrors] = useState(formRegisterValuesDefault);
    const [registerResult, setRegisterResult] = useState({});

    function OnLoad_Hooks_UseEffect() { //useEffect: Code that runs after its state has changed. Acts almost similar as to a setState callback. 
        const _registerFormValues = registerFormValues; //Needs to be included otherwise useEffect can't rerender on registerFormErrors mutation
        useEffect(() => { //Guide: https://blog.logrocket.com/guide-to-react-useeffect-hook/
            //if(JSON.stringify(_registerFormValues)  === JSON.stringify(formRegisterValuesDefault)) //Is true even if registerFormValues has been mutated before
            if (_registerFormValues === formRegisterValuesDefault) { //Condition is true when registerFormValues has not been mutated before i.e. OnLoad 
                return;
            } else if (submissionsCount < 1) {
                return;
            }
            isValid_RegisterInput();
        }, [_registerFormValues]);
    };

    const setEach_RegisterFormValue = (event) => { //setState mapped form keys to state keys thus values updated via 1-liner
        setRegisterFormValues({ ...registerFormValues, [event.target.name]: event.target.value }) //setStates are async so if you want callback/after-effect then use useEffect
    };

    const onSubmit = async (event) => {
        setSubmissionsCount(submissionsCount + 1);
        event.preventDefault(); //Prevents submitting a form normally
        if (isValid_RegisterInput()) {
            await bcryptjs.hash(registerFormValues.Password, authConstants.SALTESE).then((vHashedPassword) => {
                registerUser({ variables: { Password: vHashedPassword } })
            });
        }
    };

    function isValid_RegisterInput() { //Does also refresh error state by setting new errors on register form error array
        let errorsObject = {}; //Can't (errorObject = formRegisterValuesDefault), else it'll reference and mutate formRegisterValuesDefault values
        errorsObject = Object.assign(formRegisterValuesDefault); //copies formRegisterValuesDefault values
        Object.keys(registerFormValues).forEach((key) => {
            if (registerFormValues[key] === '') {
                errorsObject[key] = `${key} cannot be empty`;
            }
        });
        if (registerFormValues.Password !== '' && registerFormValues.ConfirmPassword !== '' && registerFormValues.Password !== registerFormValues.ConfirmPassword) {
            errorsObject['Password'] = 'Passwords must match';
            errorsObject['ConfirmPassword'] = '';
        };
        if (registerFormValues['Email'].length > 0) {
            errorsObject['Email'] = isEmailFormatValid();
        }
        setRegisterFormErrors(errorsObject); //Set only commits after function has completed
        let isValid_RegisterInput = true;
        Object.values(errorsObject).forEach((error, index) => {
            if (error !== undefined && error !== '') {
                isValid_RegisterInput = false;
            }
        });
        return isValid_RegisterInput; //Explicit so it is readable for other devs
    };

    //Hoisted (Javascript functions)
    function isEmailFormatValid() {
        //use eslint-disable-line (for in-line) or eslint-disable-next-line (next line)
        //eslint-disable-next-line
        const email_regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!email_regEx.test(String(registerFormValues.Email).toLowerCase())) {
            return 'Email format is invalid';
        }
        return "";
    }

    const [registerUser, { loading }] = useMutation(REGISTER_USER, {
        update(proxy, { data: { register: register_SuccessResponse } }) {
            if (register_SuccessResponse !== null && typeof register_SuccessResponse === 'object'
                && Object.keys(register_SuccessResponse).length > 0) {
                setRegisterResult(register_SuccessResponse); //to trigger useEffect dependency
                if (register_SuccessResponse.status === 'successful') {
                    setTimeout(() => history.push(URL.login), 1500);
                }
            }
        },
        onError({ graphQLErrors, networkError }) {
            let errorsArray = [];
            if (graphQLErrors && graphQLErrors.length > 0) { /*happens inside resolvers*/
                Object.values(Object.values(graphQLErrors[0].extensions)[0]).forEach(errorMessage => {
                    errorsArray.push(errorMessage);
                })
            }
            else { /*happens outside of resolvers, typically if haven't met typeDefs requirements. Therefore Fix code to meet requirements of graphQL call*/
                //if (networkError && networkError.result && networkError.result.errors.length > 0)    
                /*networkError.result.errors.forEach(error => {
                        //errorsArray.push(error.message); //e.g. Variable "$Username" is not defined by operation "Login". or Variable "$Usernaame" is never used in operation "Login".
                    });*/
                errorsArray.push("Connectivity issue. Please try again later");
            };
            setRegisterFormErrors(errorsArray); //Iterable by map
        },
        variables: registerFormValues
    });

    return (
        <div>
            <Header
                absolute
                color="transparent"
                brand="Huddle"
                rightLinks={<HeaderLinks />}
                {...rest}
            />
            <div
                className={classes.pageHeader}
                style={{
                    backgroundImage: "url(" + image + ")",
                    backgroundSize: "cover",
                    backgroundPosition: "top center",
                }}
            >
                <div className={classes.container}>
                    {OnLoad_Hooks_UseEffect() /*Component capitilised. Needs to be enclosed in HTML*/}
                    <GridContainer justify="center">
                        <GridItem xs={12} sm={12} md={4}>
                            <Card className={classes[cardAnimaton]}>
                                {(registerResult !== null && Object.keys(registerResult).length > 0 && registerResult.status === 'successful')
                                    ?
                                    <div key={'REGISTER_USER_success'}>
                                        <a href={URL.login}> Successfully registered.. <br /> <br /> Redirecting... Click here if it has not managed to do so </a>
                                    </div>
                                    :
                                    <form onSubmit={onSubmit} noValidate className={loading ? 'loading' : classes.form}> {/*noValidate = disable HTML5 validation for a form*/}
                                        <CardHeader color="info" className={classes.cardHeader}>
                                            <h4>Register</h4>
                                        </CardHeader>
                                        <Link
                                            to={URL.login}>
                                            <p className={classes.divider}>Already a member?</p>
                                        </Link>
                                        <CardBody>
                                            <CustomInput
                                                labelText="Username..."
                                                id="user"
                                                error={{ ...registerFormErrors }.Username === undefined || { ...registerFormErrors }.Username.length > 0 ? true : false}
                                                errorText={({ ...registerFormErrors }.Username && { ...registerFormErrors }.Username.length > 0) ? { ...registerFormErrors }.Username
                                                    : null
                                                }
                                                errorTextProps={{
                                                    className: classes.labelSubtitle,
                                                }}
                                                formControlProps={{
                                                    fullWidth: true,
                                                }}
                                                inputProps={{
                                                    type: "text",
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <AccountBox className={classes.inputIconsColor} />
                                                        </InputAdornment>
                                                    ),
                                                    autoComplete:"off",
                                                    name: "Username",
                                                    value: registerFormValues.Username,
                                                    onChange: (e) => setEach_RegisterFormValue(e),
                                                }}
                                            />
                                            <CustomInput
                                                labelText="Full Name..."
                                                id="fullname"
                                                error={{ ...registerFormErrors }.FullName === undefined || { ...registerFormErrors }.FullName.length > 0 ? true : false}
                                                errorText={({ ...registerFormErrors }.FullName && { ...registerFormErrors }.FullName.length > 0) ? { ...registerFormErrors }.FullName
                                                    : null
                                                }
                                                errorTextProps={{
                                                    className: classes.labelSubtitle,
                                                }}
                                                formControlProps={{
                                                    fullWidth: true,
                                                }}
                                                inputProps={{
                                                    type: "text",
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <People className={classes.inputIconsColor} />
                                                        </InputAdornment>
                                                    ),
                                                    autoComplete:"off",
                                                    name: "FullName",
                                                    value: registerFormValues.FullName,
                                                    onChange: (e) => setEach_RegisterFormValue(e),
                                                }}
                                            />
                                            <CustomInput
                                                labelText="Email..."
                                                id="email"
                                                error={{ ...registerFormErrors }.Email === undefined || { ...registerFormErrors }.Email.length > 0 ? true : false}
                                                errorText={({ ...registerFormErrors }.Email && { ...registerFormErrors }.Email.length > 0) ? { ...registerFormErrors }.Email
                                                    : null
                                                }
                                                errorTextProps={{
                                                    className: classes.labelSubtitle,
                                                }}
                                                formControlProps={{
                                                    fullWidth: true,
                                                }}
                                                inputProps={{
                                                    type: "text",
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <Email className={classes.inputIconsColor} />
                                                        </InputAdornment>
                                                    ),
                                                    autoComplete:"off",
                                                    name: "Email",
                                                    value: registerFormValues.Email,
                                                    onChange: (e) => setEach_RegisterFormValue(e),
                                                }}
                                            />
                                            <CustomInput
                                                labelText="Password..."
                                                id="pass"
                                                error={{ ...registerFormErrors }.Password === undefined || { ...registerFormErrors }.Password.length > 0 ? true : false}
                                                errorText={({ ...registerFormErrors }.Password && { ...registerFormErrors }.Password.length > 0) ? { ...registerFormErrors }.Password
                                                    : null
                                                }
                                                errorTextProps={{
                                                    className: classes.labelSubtitle,
                                                }}
                                                formControlProps={{
                                                    fullWidth: true,
                                                }}
                                                inputProps={{
                                                    type: "password",
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <Icon className={classes.inputIconsColor}>
                                                                lock_outline
                                                            </Icon>
                                                        </InputAdornment>
                                                    ),
                                                    autoComplete:"off",
                                                    name: "Password",
                                                    value: registerFormValues.Password,
                                                    onChange: (e) => setEach_RegisterFormValue(e),
                                                }}
                                            />
                                            <CustomInput
                                                labelText="Confirm Password..."
                                                id="pass"
                                                error={{ ...registerFormErrors }.ConfirmPassword === undefined || { ...registerFormErrors }.ConfirmPassword.length > 0 ? true : false}
                                                errorText={({ ...registerFormErrors }.ConfirmPassword && { ...registerFormErrors }.ConfirmPassword.length > 0) ? { ...registerFormErrors }.ConfirmPassword
                                                    : null
                                                }
                                                errorTextProps={{
                                                    className: classes.labelSubtitle,
                                                }}
                                                formControlProps={{
                                                    fullWidth: true,
                                                }}
                                                inputProps={{
                                                    type: "password",
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <Icon className={classes.inputIconsColor}>
                                                                lock_outline
                                                            </Icon>
                                                        </InputAdornment>
                                                    ),
                                                    autoComplete:"off",
                                                    name: "ConfirmPassword",
                                                    value: registerFormValues.ConfirmPassword,
                                                    onChange: (e) => setEach_RegisterFormValue(e),
                                                }}
                                            />
                                        </CardBody>
                                        <p className={classes.dangerColor + " " + classes.labelInfoCentered}> {({ ...registerFormErrors }.Username === undefined) ? (Object.keys(registerFormErrors).length > 0) ?
                                            { ...registerFormErrors }["0"] : null : null} </p>
                                        <CardFooter className={classes.cardFooter}>
                                            <Button
                                                color="info"
                                                size="lg"
                                                rel="noopener noreferrer"
                                                type='submit'
                                            >
                                                Register
                                            </Button>
                                        </CardFooter>
                                    </form>
                                }
                            </Card>
                        </GridItem>
                    </GridContainer>
                </div>
                <Footer whiteFont />
            </div>
        </div>
    );
}
