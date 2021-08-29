import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { URL } from "../../AppLinks"

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Toolbar from '@material-ui/core/Toolbar';
import Box from '@material-ui/core/Box';
import MuiDrawer from '@material-ui/core/Drawer';

import MuiAppBar from '@material-ui/core/AppBar';

import ExitToApp from "@material-ui/icons/ExitToApp";
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import ForumIcon from '@material-ui/icons/Forum';
import PublicIcon from '@material-ui/icons/Public';

import { makeStyles } from "@material-ui/core/styles";
import { styled } from '@material-ui/core/styles';
import barMenusStyle, { taskNavbarStyleBase, channelBarStyleBase, channelBarStyleClosed } from "assets/jss/mkr/components/barMenusStyle";

import GridItem from "components/Grid/GridItem";
import CustomButton from "../../components/CustomButtons/Button";
import { DialogWarning } from "../../components/CustomDialog/CustomDialog";
import CustomDropdown from "../../components/CustomDropdown/CustomDropdown";

export function AppBar(props) {
  let useStyles = makeStyles(theme => barMenusStyle);
  let classes = useStyles();
  classes = { ...classes, ...props.classes };
  const [isExitConfirmationDialogOpen, setIsExitConfirmationDangerOpen] = useState(false);
  return (
    <MuiAppBar className={classes.appBar}>
      <Toolbar>
        <Box
          flexGrow={1}>
          <CustomButton
            onClick={props.onClickBrand ?
              props.onClickBrand
              :
              () => setIsExitConfirmationDangerOpen(true)
            }
            color='transparent'
          >
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Huddle
            </Typography>
          </CustomButton>
        </Box>
        <CustomDropdown
          buttonIcon={ExitToApp}
          hoverColor="transparent"
          buttonProps={{
            className: classes.dropdownLink,
            color: "transparent",
          }}
          dropdownList={[
            <a href="/logout">
              <Typography noWrap>
                Logout
              </Typography>
            </a>,
          ]}
        />
      </Toolbar>
      <DialogWarning
        classes={props.classes}
        open={isExitConfirmationDialogOpen}
        modalTitle="Exit?"
        modalDescriptionHTML={
          <p>
            Exit to Huddle homepage? <br /><br /> Your changes will be discarded.
          </p>
        }
        modalActionButtonHTML={
          <Link to={URL.home}>
            <CustomButton color="danger" simple > <MeetingRoomIcon /> Exit </CustomButton>
          </Link>
        }
        onCloseEvent={() => setIsExitConfirmationDangerOpen(false)}
      />
    </MuiAppBar>
  );
};
AppBar.propTypes = {
  classes: PropTypes.object,
  onClickBrand: PropTypes.func,
};

export function TaskNavbar(props) {
  let useStyles = makeStyles(theme => barMenusStyle);
  let classes = useStyles();
  classes = { ...classes, ...props.classes };
  return (
    <TaskNavbarStyled className={classes.taskNavbar}>
      <List>
        <ListItem className={classes.taskNavbarListItem}>
          <ForumIcon />
        </ListItem>
      </List>
    </TaskNavbarStyled >
  );
};
TaskNavbar.propTypes = {
  classes: PropTypes.object,
};
const TaskNavbarStyled = styled(GridItem)(
  ({ theme }) => taskNavbarStyleBase(theme)
);

export function ChannelBar(props) {
  let useStyles = makeStyles(theme => barMenusStyle);
  let classes = useStyles();
  classes = { ...classes, ...props.classes };
  return (
    <ChannelBarStyled open={props.open} variant={props.variant} className={classes.channelBar}>
      <List>
        <ListItem onClick={props.toggleOpenChannel}>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
          >
            Public
          </Typography>
        </ListItem>
        <Divider />
        <ListItem button onClick={props.toggleOpenChannel}>
          <ListItemText primary={<h5><PublicIcon /><b> General</b></h5>} />
        </ListItem>
      </List>
    </ChannelBarStyled>
  );
};
ChannelBar.propTypes = {
  classes: PropTypes.object,
  variant: PropTypes.string,
  open: PropTypes.bool.isRequired,
  toggleOpenChannel: PropTypes.func.isRequired,
};
const ChannelBarStyled = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open, variant, className }) => (
    {
      variant,
      className,
      '& .MuiDrawer-paper': ({
        ...(channelBarStyleBase(theme)),
        ...(open && channelBarStyleClosed(theme))
      })
    })
);

