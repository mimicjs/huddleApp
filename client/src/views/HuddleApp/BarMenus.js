import * as React from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Toolbar from '@material-ui/core/Toolbar';
import Box from '@material-ui/core/Box';
import MuiDrawer from '@material-ui/core/Drawer';

import MuiAppBar from '@material-ui/core/AppBar';

import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import ForumIcon from '@material-ui/icons/Forum';
import PublicIcon from '@material-ui/icons/Public';

import classNames from 'classnames';
import { styled } from '@material-ui/core/styles';
import styles, { taskNavbarStyleBase, channelBarStyleBase, channelBarStyleClosed } from "assets/jss/mkr/components/barMenusStyle";

import GridItem from "components/Grid/GridItem";
import CustomButton from "../../components/CustomButtons/Button";
import CustomDropdown from "../../components/CustomDropdown/CustomDropdown";

export const barMenuStyles = styles;

export function AppBar(props) {
  const classes = props.classes;
  return (
    <MuiAppBar className={classNames(classes.AppBar)}>
      <Toolbar>
        <Box
          flexGrow={1}>
          <CustomButton onClick={props.toggleOpenChannel} color='transparent'>
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
          buttonIcon={MeetingRoomIcon}
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
    </MuiAppBar>
  );
};

export function TaskNavbar(props) {
  const classes = props.classes;
  return (
    <TaskNavbarStyled className={classNames(classes.TaskNavbar)}>
      <List>
        <ListItem className={classes.TaskNavbarListItem}>
          <ForumIcon />
        </ListItem>
      </List>
    </TaskNavbarStyled >
  );
};

const TaskNavbarStyled = styled(GridItem)(
  ({ theme }) => taskNavbarStyleBase(theme)
);

export function ChannelBar(props) {
  const classes = props.classes;
  return (
    <ChannelBarStyled open={props.open} variant={props.variant} onClose={props.toggleOpenChannel}
      className={classNames(classes.ChannelBar)}>
      <List>
        <ListItem>
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
        <ListItem button>
          <ListItemText primary={<h5><PublicIcon /><b> General</b></h5>} />
        </ListItem>
      </List>
    </ChannelBarStyled>
  );
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