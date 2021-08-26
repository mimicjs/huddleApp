import React from "react";
import { Link } from "react-router-dom"; // react components for routing our app without refresh
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons
import { LinkedIn, GitHub } from "@material-ui/icons";

// core components
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardFooter from "components/Card/CardFooter";
import IconButton from "@material-ui/core/IconButton";

import styles from "assets/jss/mkr/views/landingPageSections/teamStyle";

import founder from "assets/img/faces/founder.jpg";
import developer from "assets/img/faces/developer.jpg";
import plant_waterer from "assets/img/faces/plant_waterer.jpg";

const useStyles = makeStyles(styles);

export default function TeamSection() {
  const classes = useStyles();
  const imageClasses = classNames(
    classes.imgRaised,
    classes.imgRoundedCircle,
    classes.imgFluid
  );
  return (
    <div className={classes.section}>
      <h2 className={classes.title}>Meet the Team</h2>
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={4}>
            <Card plain>
              <Link
                to='/profile'
                onClick={() => window.scrollTo(0,0)}>
                <GridItem xs={12} sm={12} md={6} className={classes.itemGrid}>
                  <img src={founder} alt="..." className={imageClasses} />
                </GridItem>
                <h4 className={classes.cardTitle}>
                  J. Shew
                  <br />
                  <small className={classes.smallTitle}>Founder</small>
                </h4>
                <CardBody>
                  <p className={classes.description}>
                    Jacky is the Founder of Huddle. <br />
                    He assumes the roles of: Chief Executive, Operations, Risk, Product Owner, Project Lead.
                  </p>
                  <br />
                  <br />
                  <br />
                </CardBody>
              </Link>
              <CardFooter className={classes.justifyCenter}>
                <IconButton
                  className={classes.margin5}
                  aria-label="open drawer"
                  target="__blank"
                  rel="noreferrer"
                  href="https://linkedin.com/in/jacky-shew-05ba15135/"
                >
                  <LinkedIn className={classes.linkedInIcon} />
                </IconButton>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <Card plain>
              <Link
                to='/profile'
                onClick={() => window.scrollTo(0,0)}>
                <GridItem xs={12} sm={12} md={6} className={classes.itemGrid}>
                  <img src={developer} alt="..." className={imageClasses} />
                </GridItem>
                <h4 className={classes.cardTitle}>
                  Jacky Shew
                  <br />
                  <small className={classes.smallTitle}>Developer</small>
                </h4>
                <CardBody>
                  <p className={classes.description}>
                    Spending most of his career within the Finance industry and delivering software solutions
                    from requirements gathering, to: solutioning, implementation, and maintenance.
                    <br /><br /> He{"'"}s the one
                  </p>
                </CardBody>
              </Link>
              <CardFooter className={classes.justifyCenter}>
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
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <Card plain>
              <Link
                to='/profile'
                onClick={() => window.scrollTo(0,0)}>
                <GridItem xs={12} sm={12} md={6} className={classes.itemGrid}>
                  <img src={plant_waterer} alt="..." className={imageClasses} />
                </GridItem>
                <h4 className={classes.cardTitle}>
                  Jacky S.
                  <br />
                  <small className={classes.smallTitle}>Plant Waterer</small>
                </h4>
                <CardBody>
                  <p className={classes.description}>
                    He waters our plants. <br />
                    Practices his kickboxing, stares at cars, and <br />
                    plays his Trading Card Games when he isn{"'"}t.
                  </p>
                </CardBody>
              </Link>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    </div>
  );
}
