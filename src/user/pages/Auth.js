import React, { useEffect } from "react";

import { useHttpRequest } from "../../shared/hooks/http-hook";

import { loginHandler } from "../../shared/util/social-network-login";
import { useDispatch } from "react-redux";
import { authActions } from "../../shared/store/auth";

import {
  Button,
  Container,
  Typography,
  Box,
  makeStyles,
  Avatar,
  CircularProgress,
  Backdrop,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { useHistory } from "react-router";

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
    textAlign: "center",
  },
  button: {
    marginBottom: theme.spacing(5),
  },
}));

const Auth = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const { isLoading, error, sendRequest, clearError, setError } =
    useHttpRequest();
  const url = `https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize?client_id=${process.env.REACT_APP_MICROSOFT_CLIENT_ID}&response_type=code&redirect_uri=${process.env.REACT_APP_AUTH_REDIRECT_URI}&response_mode=query&scope=offline_access%20user.read%20mail.read`;
  useEffect(() => {
    const timer = setTimeout(() => {
      clearError();
    }, 5000);
    return () => clearTimeout(timer);
  }, [error, clearError]);

  const microsoftUserLogin = async (code, socialNetwork) => {
    try {
      const response = await sendRequest(
        `https://localhost:5000/api/social-networks/${socialNetwork}/auth`,
        "POST",
        JSON.stringify({
          code: code,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      dispatch(
        authActions.login({
          userId: response.userId,
          token: response.token,
          userSocialNetworksTokens: response.userSocialNetworksTokens,
        })
      );
      if (response.userSocialNetworksTokens.allTokensValids) {
        history.push("/new-post");
      } else {
        history.push("/social-networks");
      }
    } catch (err) {}
  };
  return (
    <React.Fragment>
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
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant="h5" color="inherit">
            Iniciar Sesion
          </Typography>

          <Box m={3}>
            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              onClick={loginHandler.bind(
                this,
                url,
                "microsoft",
                setError,
                microsoftUserLogin
              )}
            >
              Ingresar a traves de Microsoft
            </Button>
          </Box>
        </div>
      </Container>
    </React.Fragment>
  );
};

export default Auth;
