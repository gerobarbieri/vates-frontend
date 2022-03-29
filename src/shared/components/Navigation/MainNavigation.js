import React, { useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Box from "@material-ui/core/Box";
import MenuIcon from "@material-ui/icons/Menu";
import NavLinks from "./NavLinks";

import logo from "../../../images/vates.png";
import {
  Button,
  IconButton,
  makeStyles,
  Drawer,
  Hidden,
} from "@material-ui/core";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const useStyle = makeStyles((theme) => ({
  offset: theme.mixins.toolbar,

  logoButton: {
    flexGrow: 1,
    justifyContent: "flex-start",
  },
  logo: {
    maxWidth: 100,
    marginRight: theme.spacing(2),
  },
}));

const MainNavigation = () => {
  const classes = useStyle();
  const auth = useSelector((state) => state.auth);
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  const openDrawerHandler = () => {
    setDrawerIsOpen(true);
  };

  const closeDrawerHandler = () => {
    setDrawerIsOpen(false);
  };

  return (
    <React.Fragment>
      <Drawer open={drawerIsOpen} onClose={closeDrawerHandler} anchor="right">
        <NavLinks drawer="true" onClick={closeDrawerHandler} />
      </Drawer>
      <AppBar position="fixed" color="secondary">
        <Toolbar>
          <Button component={NavLink} to="/" className={classes.logoButton}>
            <img src={logo} alt="Vates" className={classes.logo} />
          </Button>
          <Hidden xsDown>
            <Box>
              <NavLinks />
            </Box>
          </Hidden>
          <Hidden smUp>
            {!auth.isLoggedIn && (
              <Button
                component={NavLink}
                to="/auth"
                variant="outlined"
                color="inherit"
                size="small"
              >
                Ingresar
              </Button>
            )}
            {auth.isLoggedIn && auth.userSocialNetworksTokens.allTokensValids && (
              <Button
                component={NavLink}
                to="/new-post"
                variant="outlined"
                color="inherit"
                size="small"
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
                size="small"
              >
                Dar permisos
              </Button>
            )}
            <IconButton
              color="inherit"
              aria-label="menu"
              onClick={openDrawerHandler}
            >
              <MenuIcon />
            </IconButton>
          </Hidden>
        </Toolbar>
      </AppBar>

      <div className={classes.offset}></div>
    </React.Fragment>
  );
};

export default MainNavigation;
