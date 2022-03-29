import React from "react";
import { NavLink } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../../store/auth";
import {
  makeStyles,
  Button,
  List,
  ListItem,
  Divider,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import PostAddIcon from "@material-ui/icons/PostAdd";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import PersonIcon from "@material-ui/icons/Person";
import SettingsApplicationsIcon from "@material-ui/icons/SettingsApplications";

const useStyle = makeStyles((theme) => ({
  button: {
    marginRight: theme.spacing(2),
  },
  toolbar: theme.mixins.toolbar,
  list: {
    width: 250,
  },
  footer: {
    position: "fixed",
    bottom: 0,
    width: "100%",
  },
}));

const NavLinks = (props) => {
  const classes = useStyle();
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  let content = (
    <React.Fragment>
      {auth.isLoggedIn && auth.userSocialNetworksTokens.allTokensValids && (
        <Button
          component={NavLink}
          to="/new-post"
          variant="outlined"
          color="inherit"
          className={classes.button}
        >
          Nueva publicacion
        </Button>
      )}
      {auth.isLoggedIn && !auth.userSocialNetworksTokens.allTokensValids && (
        <Button
          component={NavLink}
          to="/social-networks"
          variant="outlined"
          color="inherit"
          className={classes.button}
        >
          Dar permisos a las redes sociales
        </Button>
      )}
      {!auth.isLoggedIn && (
        <Button component={NavLink} to="/auth" variant="text" color="inherit">
          Ingresar
        </Button>
      )}
      {auth.isLoggedIn && (
        <Button
          onClick={() => dispatch(authActions.logout())}
          variant="text"
          color="inherit"
        >
          Cerrar sesion
        </Button>
      )}
    </React.Fragment>
  );
  if (props.drawer) {
    content = (
      <div
        className={classes.list}
        onClick={props.onClick}
        onKeyDown={props.onClick}
      >
        <div className={classes.toolbar} />
        <Divider />
        <List>
          {auth.isLoggedIn && auth.userSocialNetworksTokens.allTokensValids && (
            <ListItem
              button
              variant="outlined"
              component={NavLink}
              to="/new-post"
            >
              <ListItemIcon>
                <PostAddIcon />
              </ListItemIcon>
              <ListItemText primary="Nueva publicacion" />
            </ListItem>
          )}
          {auth.isLoggedIn && !auth.userSocialNetworksTokens.allTokensValids && (
            <ListItem button component={NavLink} to="/social-networks">
              <ListItemIcon>
                <SettingsApplicationsIcon />
              </ListItemIcon>
              <ListItemText primary="Dar permisos a las redes sociales" />
            </ListItem>
          )}
          {!auth.isLoggedIn && (
            <ListItem button component={NavLink} to="/auth">
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Ingresar" />
            </ListItem>
          )}
        </List>

        {auth.isLoggedIn && (
          <React.Fragment>
            <List className={classes.footer}>
              <Divider />
              <ListItem button onClick={() => dispatch(authActions.logout())}>
                <ListItemIcon>
                  <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText primary="Cerrar sesion" />
              </ListItem>
            </List>
          </React.Fragment>
        )}
      </div>
    );
  }
  return content;
};

export default NavLinks;
