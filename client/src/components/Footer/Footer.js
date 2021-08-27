/*eslint-disable*/
import React from "react";
import { Link } from "react-router-dom"; // react components for routing our app without refresh
// nodejs library to set properties for components
import PropTypes from "prop-types";
// nodejs library that concatenates classes
import classNames from "classnames";

import { URL } from '../../AppLinks';
// material-ui core components
import { List, ListItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons
import Favorite from "@material-ui/icons/Favorite";

import styles from "assets/jss/mkr/components/footerStyle";

const useStyles = makeStyles(styles);

export default function Footer(props) {
  const classes = useStyles();
  const { whiteFont } = props;
  const footerClasses = classNames({
    [classes.footer]: true,
    [classes.footerWhiteFont]: whiteFont,
  });
  const aClasses = classNames({
    [classes.a]: true,
    [classes.footerWhiteFont]: whiteFont,
  });
  return (
    <footer className={footerClasses}>
      <div className={classes.container}>
        <div className={classes.left}>
          <List className={classes.list}>
            <ListItem className={classes.inlineBlock}>
              <Link
                to={URL.index}
                className={classes.block}
                rel="noreferrer"
                onClick={() => window.scrollTo(0, 0)}
              >
                Huddle
              </Link>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <Link
                to={URL.profile}
                className={classes.block}
                rel="noreferrer"
                onClick={() => window.scrollTo(0, 0)}
              >
                About me
              </Link>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a
                href={URL.myLinkedIn}

                className={classes.block}
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a
                href={URL.myGithub}
                className={classes.block}
                target="_blank"
                rel="noreferrer"
              >
                Github
              </a>
            </ListItem>
          </List>
        </div>
        <div className={classes.right}>
          &copy; {1900 + new Date().getYear()}{" "}
          by{" "}
          <Link
            to={URL.profile}
            className={aClasses}
            rel="noreferrer"
            onClick={() => window.scrollTo(0, 0)}
          >
            Jacky Shew
          </Link>
        </div>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  whiteFont: PropTypes.bool,
};
