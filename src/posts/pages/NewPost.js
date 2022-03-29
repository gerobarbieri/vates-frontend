import React, { useEffect } from "react";

import { useForm } from "../../shared/hooks/form-hook";
import { useHttpRequest } from "../../shared/hooks/http-hook";
import { useSelector } from "react-redux";

import Input from "../../shared/components/FormElements/Input";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

import { VALIDATOR_MINLENGTH } from "../../shared/util/input-validators";
import {
  Typography,
  makeStyles,
  Container,
  FormControl,
  Button,
  Avatar,
  Fade,
  CircularProgress,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import PublishIcon from "@material-ui/icons/Publish";

const useStyles = makeStyles((theme) => ({
  placeholder: {
    height: 40,
    textAlign: "center",
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: theme.spacing(4),
  },
  form: {
    width: "80%",
    marginTop: theme.spacing(3),
  },
  avatar: {
    margin: theme.spacing(1),
    marginTop: theme.spacing(5),
    backgroundColor: theme.palette.primary.main,
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    marginBottom: theme.spacing(5),
  },
}));

const NewPost = (props) => {
  const auth = useSelector((state) => state.auth);
  const classes = useStyles();
  const { isLoading, error, sendRequest, clearError, success, clearSuccess } =
    useHttpRequest();

  const [formState, inputHandler, setFormData] = useForm(
    {
      image: {
        value: "",
        isValid: false,
      },
      text: {
        value: "",
        isValid: false,
      },
    },
    false
  );

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

  const postSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("text", formState.inputs.text.value);
      formData.append("image", formState.inputs.image.value);
      await sendRequest(
        `https://localhost:5000/api/social-networks/post`,
        "POST",
        formData,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      setFormData(
        {
          image: {
            value: undefined,
            isValid: false,
          },
          text: {
            value: "",
            isValid: false,
          },
        },
        false
      );
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
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <PublishIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Subir una publicacion
          </Typography>
          <form onSubmit={postSubmitHandler} className={classes.form}>
            <FormControl fullWidth={true}>
              <ImageUpload
                id="image"
                onInput={inputHandler}
                file={formState.inputs.image.value}
              />
            </FormControl>
            <FormControl fullWidth={true}>
              <Typography variant="p">Texto de la publicacion:</Typography>
              <Input
                id="text"
                element="textarea"
                validators={[VALIDATOR_MINLENGTH(5)]}
                value={formState.inputs.text.value}
                onInput={inputHandler}
              />
            </FormControl>
            {isLoading && (
              <div className={classes.placeholder}>
                <Fade
                  in={isLoading}
                  style={{
                    transitionDelay: isLoading ? "800ms" : "0ms",
                  }}
                  unmountOnExit
                >
                  <CircularProgress color="primary" />
                </Fade>
              </div>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={!formState.isValid}
            >
              Subir Publicacion
            </Button>
          </form>
        </div>
      </Container>
    </React.Fragment>
  );
};

export default NewPost;
