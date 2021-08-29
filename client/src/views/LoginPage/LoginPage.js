import React, { useEffect, useState, useContext } from 'react';
import { Link } from "react-router-dom"; // react components for routing our app without refresh
import { useMutation } from '@apollo/react-hooks';
import moment from 'moment';
import bcryptjs from 'bcryptjs';
import { URL } from '../../AppLinks';
import { AuthContext, authConstants, isLocalRefreshValid } from '../../context/auth';
import { LOGIN_USER } from '../../API/API';
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { InputAdornment, Icon } from "@material-ui/core";
// @material-ui/icons
import { AccountBox, Close } from "@material-ui/icons";
// core components
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import CardFooter from "components/Card/CardFooter";
import CustomInput from "components/CustomInput/CustomInput";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Header from "components/Header/Header";
import HeaderLinks from "components/Header/HeaderLinks";
import Footer from "components/Footer/Footer";
import IconButton from "@material-ui/core/IconButton";
import Button from "components/CustomButtons/Button";
import Slide from "@material-ui/core/Slide";

import styles from "assets/jss/mkr/views/loginPage";

import image from "assets/img/bg7.jpg"; //https://unsplash.com/photos/F7HGqkkMYAU

const useStyles = makeStyles(styles);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

Transition.displayName = "Transition";

export default function LoginPage(props) {
  const context = useContext(AuthContext);
  const formLoginValuesDefault = {
    Username: '',
    Password: ''
  };
  const [loginFormValues, setLoginFormValues] = useState(formLoginValuesDefault); //mutable
  const [loginFormErrors, setLoginFormErrors] = useState(formLoginValuesDefault);
  const [loginResult, setLoginResult] = useState({ status: 'initialised' }); //need something initially else it will trigger on first render
  const [submissionsCount, setSubmissionsCount] = useState(0);

  const [cardAnimaton, setCardAnimation] = useState("cardHidden");
  const [isModalForgotPasswordOpen, setIsModalForgotPasswordOpen] = useState(false);
  setTimeout(function () {
    setCardAnimation("");
  }, 700);
  const classes = useStyles();
  const { ...rest } = props;

  OnLoad_Hooks_UseEffect();
  function OnLoad_Hooks_UseEffect() { //useEffect: Code that runs after its state has changed. Acts almost similar as to a setState callback. 
    const _loginFormValues = loginFormValues; //Needs to be included otherwise useEffect can't rerender on loginFormErrors mutation
    useEffect(() => { //Guide: https://blog.logrocket.com/guide-to-react-useeffect-hook/
      //if(JSON.stringify(_loginFormValues)  === JSON.stringify(formLoginValuesDefault)) //Is true even if loginFormValues has been mutated before
      if (_loginFormValues === formLoginValuesDefault) { //Condition is true when loginFormValues has not been mutated before i.e. OnLoad 
        return;
      } else if (submissionsCount < 1) {
        return;
      }
      isValid_LoginInput();
    }, [_loginFormValues]);
    const _loginResult = loginResult;
    useEffect(() => {
      if (_loginResult instanceof Object) {
        if (_loginResult.status === 'successful') { //We've got Refresh cookie
        } else {
          if (_loginResult.status === 'unsuccessful') { //Couldn't get Refresh cookie
            setLoginFormErrors(['Invalid credentials']);
          }
        }
        return;
      }
    }, [_loginResult]);
  };

  const setEach_LoginFormValue = (event) => { //setState mapped form keys to state keys thus values updated via 1-liner
    setLoginFormValues({ ...loginFormValues, [event.target.name]: event.target.value }) //setStates are async so if you want callback/after-effect then use useEffect
  };

  const onSubmit = async (event) => {
    setSubmissionsCount(submissionsCount + 1);
    event.preventDefault(); //Prevents submitting a form normally
    if (isValid_LoginInput()) {
      await bcryptjs.hash(loginFormValues.Password, authConstants.SALTESE).then((vHashedPassword) => {
        loginUser({ variables: { Password: vHashedPassword } })
      });
    }
  };

  function isValid_LoginInput() { //Does also refresh error state by setting new errors on login form error array
    let errorsObject = {}; //Can't (errorObject = formLoginValuesDefault), else it'll reference and mutate formLoginValuesDefault values
    errorsObject = Object.assign(formLoginValuesDefault); //copies formLoginValuesDefault values
    Object.keys(loginFormValues).forEach((key) => {
      if (loginFormValues[key] === '') {
        errorsObject[key] = `${key} cannot be empty`;
      }
    });
    setLoginFormErrors(errorsObject);
    let isValid_LoginInput = true;
    Object.values(loginFormErrors).forEach((error, index) => {
      if (error !== undefined && error !== '') {
        isValid_LoginInput = false;
      }
    });
    return isValid_LoginInput; //Explicit so it is readable for other devs
  };

  const [loginUser] = useMutation(LOGIN_USER, {
    update(proxy, { data: { login: login_SuccessResponse } }) {
      if (login_SuccessResponse !== null && typeof login_SuccessResponse === 'object'
        && Object.keys(login_SuccessResponse).length > 0 && login_SuccessResponse.status === 'successful') {
        localStorage.setItem(authConstants.LOCALSTORAGE_REFRESHEXPIRY, moment().add(48, 'h'));
        context.Access_Session();
        setLoginResult(login_SuccessResponse); //to trigger useEffect dependency
      } else {
        setLoginFormErrors(['Invalid credentials']);
      }
      return null;
    },
    onError({ graphQLErrors, networkError }) {
      let errorsArray = [];
      if (graphQLErrors && graphQLErrors.length > 0) { /*happens inside resolvers*/
        Object.values(Object.values(graphQLErrors[0].extensions)[0]).forEach(errorMessage => {
          errorsArray.push(errorMessage);
        })
      }
      else {
        //if (networkError && networkError.result && networkError.result.errors.length > 0) { /*happens outside of resolvers, typically if haven't met typeDefs requirements. Therefore Fix code to meet requirements of graphQL call*/
        /*networkError.result.errors.forEach(error => {
            //errorsArray.push(error.message); //e.g. Variable "$Username" is not defined by operation "Login". or Variable "$Usernaame" is never used in operation "Login".
        });*/
        errorsArray.push('Request issue. Please try again later');
      };
      setLoginFormErrors(errorsArray); //Iterable by map
    },
    variables: loginFormValues
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
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={4}>
              <Card className={classes[cardAnimaton]}>
                {isLocalRefreshValid()
                  ?
                  <div key={'LOGIN_USER_success'}>
                    <a href={URL.auth}> Successfully logged in
                      <br />
                      <br />** Redirecting...
                      <br />Click here if it has not managed to do so **
                    </a> {/*Does this via AuthRoute*/} {/*Chrome won't send cookies on localhost*/}
                  </div>
                  :
                  <form onSubmit={onSubmit} noValidate className={classes.form}>
                    <CardHeader color="primary" className={classes.cardHeader}>
                      <h4>Login</h4>
                    </CardHeader>
                    <Link
                      to={URL.register}>
                      <p className={classes.divider + " " + classes.linkToRegister}>Not already a member?</p>
                    </Link>
                    <CardBody>
                      <CustomInput
                        labelText="Username..."
                        id="username"
                        error={{ ...loginFormErrors }.Username === undefined || { ...loginFormErrors }.Username.length > 0 ? true : false}
                        errorText={({ ...loginFormErrors }.Username && { ...loginFormErrors }.Username.length > 0) ? { ...loginFormErrors }.Username
                          : null
                        }
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
                          autoComplete: "on",
                          name: "Username",
                          value: loginFormValues.Username,
                          onChange: (e) => setEach_LoginFormValue(e)
                        }}
                      />
                      <CustomInput
                        labelText="Password..."
                        id="pass"
                        error={{ ...loginFormErrors }.Password === undefined || { ...loginFormErrors }.Password.length > 0 ? true : false}
                        errorText={({ ...loginFormErrors }.Password && { ...loginFormErrors }.Password.length > 0) ? { ...loginFormErrors }.Password
                          : null
                        }
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
                          autoComplete: "on",
                          name: "Password",
                          value: loginFormValues.Password,
                          onChange: (e) => setEach_LoginFormValue(e)
                        }}
                      />
                      <Link to="#" onClick={() => setIsModalForgotPasswordOpen(true)}>
                        <div className={classes.labelInfoCentered}><h6>Forgot your password?</h6></div>
                      </Link>

                      <Dialog
                        classes={{
                          root: classes.center,
                          paper: classes.modal,
                        }}
                        open={isModalForgotPasswordOpen}
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={() => setIsModalForgotPasswordOpen(false)}
                        aria-labelledby="classic-modal-slide-title"
                        aria-describedby="classic-modal-slide-description"
                      >
                        <DialogTitle
                          id="classic-modal-slide-title"
                          disableTypography
                          className={classes.modalHeader}
                        >
                          <IconButton
                            className={classes.modalCloseButton}
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            onClick={() => setIsModalForgotPasswordOpen(false)}
                          >
                            <Close className={classes.modalClose} />
                          </IconButton>
                          <h4 className={classes.modalTitle}>Recovery unavailable</h4>
                        </DialogTitle>
                        <DialogContent
                          id="classic-modal-slide-description"
                          className={classes.modalBody}
                        >
                          <p>
                            Password recovery is not available at this point in time. <br />
                            Try again later or Register for a new account.
                          </p>
                        </DialogContent>
                        <div className={classes.modalFooter}>
                        </div>
                      </Dialog>
                    </CardBody>
                    <p className={classes.dangerColor + " " + classes.labelInfoCentered}> {({ ...loginFormErrors }.Username === undefined) ? (Object.keys(loginFormErrors).length > 0) ?
                      { ...loginFormErrors }["0"] : null : null} </p>
                    <CardFooter className={classes.cardFooter}>
                      <Button
                        color="primary"
                        size="lg"
                        rel="noopener noreferrer"
                        type='submit'
                      >
                        Login
                      </Button>
                    </CardFooter>
                    <div className={classes.labelInfoCentered}>
                      <br />
                      <p>We store Cookies on your device to <br /> secure your session with us.</p>
                      <br />
                    </div>
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
