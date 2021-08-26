import React, { useContext } from 'react';
import { Link, useHistory } from "react-router-dom"; // react components for routing our app without refresh
import classNames from "classnames"; // nodejs library that concatenates classes
import { makeStyles } from "@material-ui/core/styles"; // @material-ui/core components

import { URL } from '../../AppLinks';
import { AuthContext } from '../../context/auth';
// @material-ui/icons

// core components
import Header from "components/Header/Header";
import Footer from "components/Footer/Footer";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Button from "components/CustomButtons/Button";
import HeaderLinks from "components/Header/HeaderLinks";
import Parallax from "components/Parallax/Parallax";

import styles from "assets/jss/mkr/views/landingPage";

// Sections for this page
import ProductSection from "./Sections/ProductSection";
import TeamSection from "./Sections/TeamSection";
import WorkSection from "./Sections/WorkSection";

const useStyles = makeStyles(styles);

export default function LandingPage(props) {
  let history = useHistory();
  const classes = useStyles();
  const { authState, userFullName } = useContext(AuthContext); //login button function when visible is redundant thus left out
  let isLoggedIn = authState !== undefined && authState === 'ACCESSED';
  const { ...rest } = props;
  return (
    <div>
      <Header
        color="transparent"
        brand="Huddle"
        rightLinks={<HeaderLinks />}
        fixed
        changeColorOnScroll={{
          height: 400,
          color: "white",
        }}
        {...rest}
      />
      <Parallax filter image={require("assets/img/landing-bg.jpg").default}>
        <div className={classes.container}>
          <GridContainer>
            <GridItem xs={12} sm={12} md={8}>
              {isLoggedIn ? //Context User exists
                <h1 className={classes.title}>Welcome back to Huddle, <br />{userFullName}</h1>
                :
                <h1 className={classes.title}>Welcome to Huddle</h1>
              }
              <h4>
                Huddle up and collaborate with your team!
              </h4>
              {isLoggedIn ? //Context User exists
                <Button
                  color="primary"
                  size="lg"
                  rel="noopener noreferrer"
                  onClick={() => {
                    history.push(URL.dashboard);
                    //throw new Error("Force stop further code execution");
                    return null;
                  }}
                >
                  <i className="fas fa-play" />
                  Huddle
                </Button>
                :
                <div>
                  <Button
                    color="danger"
                    size="lg"
                    component={Link}
                    to={URL.login}
                    rel="noopener noreferrer"
                  >
                    <i className="fas fa-play" />
                    Login
                  </Button>
                  <Link
                    to={URL.register}>
                    <h6>
                      New to Huddle? Register here
                    </h6>
                  </Link>
                </div>
              }
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div className={classes.container}>
          <ProductSection />
          <TeamSection />
          <WorkSection />
        </div>
      </div>
      <Footer />
    </div>
  );
}
