import React, { useEffect } from "react";

import { useHttpRequest } from "../../shared/hooks/http-hook";
import { loginHandler } from "../../shared/util/social-network-login";

import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../../shared/store/auth";

import { validateSocialNetworkExpirationToken } from "../../shared/util/token-validator";

import {
  Backdrop,
  Button,
  CircularProgress,
  makeStyles,
  Container,
  Avatar,
  Typography,
} from "@material-ui/core";

import SettingsApplicationsIcon from "@material-ui/icons/SettingsApplications";

import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  paper: {
    marginTop: theme.spacing(20),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: theme.spacing(4),
  },
  avatar: {
    margin: theme.spacing(1),
    marginTop: theme.spacing(5),
    backgroundColor: theme.palette.primary.main,
  },
  button: {
    marginBottom: theme.spacing(5),
    width: "80%",
  },
  title: {
    textAlign: "center",
    marginBottom: theme.spacing(3),
  },
}));

const SocialNetworks = (props) => {
  const classes = useStyles();
  const {
    isLoading,
    error,
    sendRequest,
    clearError,
    setError,
    success,
    clearSuccess,
  } = useHttpRequest();

  const history = useHistory();
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const linkedInUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.REACT_APP_LINKEDIN_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&state=secret_super_secret&scope=r_liteprofile%20r_emailaddress%20w_member_social`;
  const facebookUrl = `https://www.facebook.com/v10.0/dialog/oauth?client_id=${process.env.REACT_APP_FACEBOOK_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&scope=pages_manage_posts pages_read_engagement instagram_basic instagram_content_publish pages_show_list&state=secret_super_secret`;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (error) {
        clearError();
      }
      if (success) {
        clearSuccess();
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [error, success, clearSuccess, clearError]);

  const getSocialNetworkToken = async (code, socialNetwork) => {
    try {
      const response = await sendRequest(
        `https://localhost:5000/api/social-networks/${socialNetwork}/auth`,
        "POST",
        JSON.stringify({
          code,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      dispatch(
        authActions.setUserPermission({
          tokenField: response.tokenField,
          tokenExpirationDate: response.tokenExpirationDate,
          allTokensValids: response.allTokensValids,
        })
      );

      if (response.allTokensValids) {
        history.push("/new-post");
      }
    } catch (err) {}
  };

  return (
    <React.Fragment>
      {success && (
        <Container maxWidth="md">
          <Alert onClose={clearSuccess} severity="success" variant="filled">
            {success}
          </Alert>
        </Container>
      )}
      {error && (
        <Container maxWidth="md">
          <Alert onClose={clearError} severity="error" variant="filled">
            {error}
          </Alert>
        </Container>
      )}

      <Container maxWidth="xs">
        {isLoading && (
          <Backdrop className={classes.backdrop} open={isLoading}>
            <CircularProgress color="primary" />
          </Backdrop>
        )}
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <SettingsApplicationsIcon />
          </Avatar>
          <Typography component="h1" variant="h5" className={classes.title}>
            Dar permisos a las redes sociales
          </Typography>

          {auth.userSocialNetworksTokens &&
            !validateSocialNetworkExpirationToken(
              auth.userSocialNetworksTokens.linkedInTokenExpirationDate
            ) && (
              <Button
                className={classes.button}
                fullWidth="true"
                variant="contained"
                color="primary"
                onClick={loginHandler.bind(
                  this,
                  linkedInUrl,
                  "linkedin",
                  setError,
                  getSocialNetworkToken
                )}
              >
                Dar permisos a Linkedin
              </Button>
            )}

          {auth.userSocialNetworksTokens &&
            !validateSocialNetworkExpirationToken(
              auth.userSocialNetworksTokens.facebookTokenExpirationDate
            ) && (
              <Button
                className={classes.button}
                fullWidth="true"
                variant="contained"
                color="primary"
                onClick={loginHandler.bind(
                  this,
                  facebookUrl,
                  "facebook",
                  setError,
                  getSocialNetworkToken
                )}
              >
                Dar permisos a Facebook e instagram
              </Button>
            )}
        </div>
      </Container>
    </React.Fragment>
  );
};

export default SocialNetworks;
