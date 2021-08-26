import React from "react";
import { makeStyles } from "@material-ui/core/styles"; // @material-ui/core components

// @material-ui/icons
import Chat from "@material-ui/icons/Chat";
import QuestionAnswer from "@material-ui/icons/QuestionAnswer";
import ThumbUp from "@material-ui/icons/ThumbUp";
// core components
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import InfoArea from "components/InfoArea/InfoArea";

import styles from "assets/jss/mkr/views/landingPageSections/productStyle";

const useStyles = makeStyles(styles);

export default function ProductSection() {
  const classes = useStyles();
  return (
    <div className={classes.section}>
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={8}>
          <h2 className={classes.title}>Huddle Up</h2>
          <h5 className={classes.description}>
            See the latest updates from your team and partners all centralised
            in one place! <br/> Making user experience the priority.
            Less frustration, more collaborating.
          </h5>
        </GridItem>
      </GridContainer>
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={4}>
            <InfoArea
              title="Open a Topic"
              description="Ideas? Updates? Issues?" 
              descriptionCrLF_2 = "Speak up to the audience of your choice!"
              icon={Chat}
              iconColor="info"
              vertical
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <InfoArea
              title="Discuss"
              description="Conversations introduce ideas, new perspectives, resolves assumptions, and prevents attempts already made"
              icon={QuestionAnswer}
              iconColor="success"
              vertical
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <InfoArea
              title="Upvote"
              description="The thumbs are here for you."
              descriptionCrLF_2 = "No talking or counting required."
              icon={ThumbUp}
              iconColor="primary"
              vertical
            />
          </GridItem>
        </GridContainer>
      </div>
    </div>
  );
}
