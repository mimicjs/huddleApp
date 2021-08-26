import { useContext } from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import styles from "../assets/jss/mkr/components/barMenusStyle";
import { makeStyles } from "@material-ui/core/styles";

import { AuthContext } from '../context/auth';

function Logout() {
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  
  const context = useContext(AuthContext);
  context.Logout();

  return (
    <div className={classes.loadingScreen}>
      <CircularProgress />
    </div>
  );
};

export default Logout;