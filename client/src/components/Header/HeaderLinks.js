/*eslint-disable*/
import React, { useContext } from 'react';
// react components for routing our app without refresh
import { Link } from "react-router-dom";
import { URL } from "../../AppLinks"
import { AuthContext } from '../../context/auth';

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

// @material-ui/icons
import { Assignment, ExitToApp } from "@material-ui/icons";

// core components
import Button from "components/CustomButtons/Button";

import styles from "assets/jss/mkr/components/headerLinksStyle";

const useStyles = makeStyles(styles);

export default function HeaderLinks(props) {
  const classes = useStyles();
  const { authState } = useContext(AuthContext);
  return (
    <List className={classes.list}>
      {(authState !== undefined && authState !== null) ? //Context User exists
        <div>
          <ListItem className={classes.listItem}>
            <Button
              color="transparent"
              rel="noreferrer"
              className={classes.navLink}
              component={Link}
              to={URL.profile}
              onClick={() => window.scrollTo(0, 0)}
            >
              <Assignment className={classes.icons} /> About Me
            </Button>
          </ListItem>
          <ListItem className={classes.listItem}>
            <Button
              color="transparent"
              rel="noreferrer"
              className={classes.navLink}
              component={Link}
              to="#"
              onClick={() => window.location.replace(URL.logout)}
            >
              <ExitToApp className={classes.icons} /> Logout
            </Button>
          </ListItem>
        </div>
        :
        <div>
          <ListItem className={classes.listItem}>
            <Button
              color="transparent"
              rel="noreferrer"
              className={classes.navLink}
              component={Link}
              to={URL.register}
              onClick={() => window.scrollTo(0, 0)}
            >
              <Assignment className={classes.icons} /> Register
            </Button>
          </ListItem>
          <ListItem className={classes.listItem}>
            <Button
              color="transparent"
              rel="noreferrer"
              className={classes.navLink}
              component={Link}
              to={URL.login}
              onClick={() => window.scrollTo(0, 0)}
            >
              <ExitToApp className={classes.icons} /> Login
            </Button>
          </ListItem>
        </div>
      }
    </List>
  );
}

/*
Security
When you use target="_blank" with Links, it is recommended to always set rel="noopener" or rel="noreferrer" when linking to third party content.
  rel="noopener" prevents the new page from being able to access the window.opener property and ensures it runs in a separate process.
                 Without this, the target page can potentially redirect your page to a malicious URL.
  rel="noreferrer" has the same effect, but also prevents the Referer header from being sent to the new page.
                   ⚠️ Removing the referrer header will affect analytics.
*/