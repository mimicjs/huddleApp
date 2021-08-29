import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import { Storefront, LocalDining, LinkedIn, GitHub } from "@material-ui/icons";
// core components
import Header from "components/Header/Header";
import Footer from "components/Footer/Footer";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import HeaderLinks from "components/Header/HeaderLinks";
import IconButton from "@material-ui/core/IconButton";
import NavPills from "components/NavPills/NavPills";
import Parallax from "components/Parallax/Parallax";

import developer from "assets/img/faces/developer.jpg";

import itwork1 from "assets/img/aboutme/itwork-1.jpg";
import itwork2 from "assets/img/aboutme/itwork-2.jpg";
import itwork3 from "assets/img/aboutme/itwork-3.jpg";
import itwork4 from "assets/img/aboutme/itwork-4.jpg";
import itwork5 from "assets/img/aboutme/itwork-5.jpg";
import itwork6 from "assets/img/aboutme/itwork-6.jpg";
import itwork7 from "assets/img/aboutme/itwork-7.jpg";
import itwork8 from "assets/img/aboutme/itwork-8.jpg";
import hobby1 from "assets/img/aboutme/hobby-1.jpg";
import hobby2 from "assets/img/aboutme/hobby-2.jpg";
import hobby3 from "assets/img/aboutme/hobby-3.jpg";
import hobby4 from "assets/img/aboutme/hobby-4.jpg";
import hobby5 from "assets/img/aboutme/hobby-5.jpg";
import hobby6 from "assets/img/aboutme/hobby-6.jpg";
import hobby7 from "assets/img/aboutme/hobby-7.jpg";
import hobby8 from "assets/img/aboutme/hobby-8.jpg";

import styles from "assets/jss/mkr/views/profilePage";

const useStyles = makeStyles(styles);

export default function ProfilePage(props) {
  const classes = useStyles();
  const { ...rest } = props;
  const imageClasses = classNames(
    classes.imgRaised,
    classes.imgRoundedCircle,
    classes.imgFluid
  );
  const navImageClasses = classNames(classes.imgRounded, classes.imgGallery);
  return (
    <div>
      <Header
        color="transparent"
        brand="Huddle"
        rightLinks={<HeaderLinks />}
        fixed
        changeColorOnScroll={{
          height: 200,
          color: "white",
        }}
        {...rest}
      />
      <Parallax
        small
        filter
        image={require("assets/img/profile-bg.jpg").default} /*https://unsplash.com/photos/DKix6Un55mw*/
      />
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div>
          <div className={classes.container}>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={6}>
                <div className={classes.profile}>
                  <div>
                    <img src={developer} alt="..." className={imageClasses} />
                  </div>
                  <div className={classes.name}>
                    <h3 className={classes.title}>Jacky Shew</h3>
                    <h6>DEVELOPER</h6>
                    <IconButton
                      className={classes.margin5}
                      aria-label="open drawer"
                      target="__blank"
                      rel="noreferrer"
                      href="https://linkedin.com/in/jacky-shew-05ba15135/"
                    >
                      <LinkedIn className={classes.linkedInIcon} />
                    </IconButton>
                    <IconButton
                      className={classes.margin5}
                      aria-label="open drawer"
                      target="__blank"
                      rel="noreferrer"
                      href="https://github.com/mimicjs/"
                    >
                      <GitHub />
                    </IconButton>
                  </div>
                </div>
              </GridItem>
            </GridContainer>
            <div className={classes.description}>
              <p>
                <h5><strong>Hey and welcome to my website!</strong></h5>
                <br />
                First of all this website acts as a showcase for who I am, <br />
                leaning more on the professional side (now 4th year as a Software Developer)<br />
                <br />
                This app currently features (last updated: 30/08/2021):
                <ul>
                  <li>Teams chat board mock (in its basic form)</li>
                  <li>GraphQL back-end based, to resolve requests</li>
                  <li>Register & Login system (JWT, think refresh and access tokens within cookies)</li>
                  <li>ExpressJS webserver serving both static front-end files and back-end</li>
                  <li>...and an aesthetic Front page</li>
                  <br />
                  <li>Code implementation is Github public repo available for employers (minus sensitive code e.g. connection strings, hashing methods)</li>
                </ul>
                <br />
                Curious, learning, and ambitious.<br />
                <br />
                I use the guiding quote from Arnold Schwarzenegger, <br />
                <strong><i>“What is the point of being on this Earth if you are going to be like everyone else?</i></strong><br />
                to remind myself to not always follow others, and that everyone has their unique journey  <br />
                <br />
                Having lived in New Zealand, Auckland all my life<br />
                It's time I moved off to a bigger city; Australia, Melbourne<br />
                <br />
                For my résumé, chat with me on LinkedIn!
              </p>
            </div>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={12} className={classes.navWrapper}>
                <NavPills
                  alignCenter
                  color="primary"
                  tabs={[
                    {
                      tabButton: "LIFE AT WORK",
                      tabIcon: Storefront,
                      tabContent: (
                        <GridContainer justify="center">
                          <GridItem xs={12} sm={12} md={3}>
                            <img alt="..." src={itwork5} className={navImageClasses} />
                            <img alt="..." src={itwork4} className={navImageClasses} />
                          </GridItem>
                          <GridItem xs={12} sm={12} md={3}>
                            <img alt="..." src={itwork1} className={navImageClasses} />
                            <img alt="..." src={itwork2} className={navImageClasses} />
                          </GridItem>
                          <GridItem xs={12} sm={12} md={3}>
                            <img alt="..." src={itwork6} className={navImageClasses} />
                            <img alt="..." src={itwork3} className={navImageClasses} />
                          </GridItem>
                          <GridItem xs={12} sm={12} md={3}>
                            <img alt="..." src={itwork7} className={navImageClasses} />
                            <img alt="..." src={itwork8} className={navImageClasses} />
                          </GridItem>
                        </GridContainer>
                      ),
                    },
                    {
                      tabButton: "INTERESTS",
                      tabIcon: LocalDining,
                      tabContent: (
                        <GridContainer justify="center">
                          <GridItem xs={12} sm={12} md={3}>
                            <img alt="..." src={hobby1} className={navImageClasses} />
                            <img alt="..." src={hobby2} className={navImageClasses} />
                          </GridItem>
                          <GridItem xs={12} sm={12} md={3}>
                            <img alt="..." src={hobby3} className={navImageClasses} />
                            <img alt="..." src={hobby4} className={navImageClasses} />
                          </GridItem>
                          <GridItem xs={12} sm={12} md={3}>
                            <img alt="..." src={hobby5} className={navImageClasses} />
                            <img alt="..." src={hobby6} className={navImageClasses} />
                          </GridItem>
                          <GridItem xs={12} sm={12} md={3}>
                            <img alt="..." src={hobby7} className={navImageClasses} />
                            <img alt="..." src={hobby8} className={navImageClasses} />
                          </GridItem>
                        </GridContainer>
                      ),
                    },
                  ]}
                />
              </GridItem>
            </GridContainer>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
