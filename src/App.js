import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import { makeStyles, ThemeProvider } from "@material-ui/core/styles";
import theme from "./shared/style/material-ui-theme-config";

import Auth from "./user/pages/Auth";
import SocialNetworks from "./socialNetworks/pages/SocialNetworks";
import NewPost from "./posts/pages/NewPost";
import MainNavigation from "./shared/components/Navigation/MainNavigation";

import { useSelector, useDispatch } from "react-redux";
import { authActions } from "./shared/store/auth";

let logoutTimer;

const useStyles = makeStyles((theme) => ({
  background: {
    position: "fixed",
    width: "100%",
    height: "100%",
    zIndex: "-1",
    backgroundColor: "#ff9800",
  },
}));

const App = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const storedData = JSON.parse(localStorage.getItem("userData"));
  const { token, tokenExpirationDate } = useSelector((state) => state.auth);

  useEffect(() => {
    //Auto Logout//
    if (token && tokenExpirationDate) {
      const remainingTime =
        new Date(tokenExpirationDate).getTime() - new Date().getTime();
      logoutTimer = setTimeout(() => {
        dispatch(authActions.logout());
      }, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, tokenExpirationDate, dispatch]);

  useEffect(() => {
    //Auto Login//
    const data = JSON.parse(localStorage.getItem("userData"));
    if (data && data.token && new Date(data.expiration) > new Date()) {
      dispatch(
        authActions.login({
          userId: data.userId,
          token: data.token,
          tokenExpirationDate: data.expiration,
          userSocialNetworksTokens: data.userSocialNetworksTokens,
        })
      );
    }
  }, [dispatch]);

  let routes;
  if (storedData && storedData.token) {
    routes = (
      <Switch>
        {!storedData.userSocialNetworksTokens.allTokensValids && (
          <Route path="/social-networks" exact>
            <SocialNetworks />
          </Route>
        )}
        {storedData.userSocialNetworksTokens.allTokensValids && (
          <Route path="/new-post" exact>
            <NewPost />
          </Route>
        )}
        {!storedData.userSocialNetworksTokens.allTokensValids ? (
          <Redirect to="/social-networks" />
        ) : (
          <Redirect to="/new-post" />
        )}
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/auth" exact>
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <MainNavigation />
        <div className={classes.background}></div>
        <main>{routes}</main>
      </Router>
    </ThemeProvider>
  );
};

export default App;
