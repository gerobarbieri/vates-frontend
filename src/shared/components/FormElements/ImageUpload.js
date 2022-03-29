import { Button, Typography, makeStyles } from "@material-ui/core";
import React from "react";
import { useRef, useState, useEffect } from "react";

const useStyle = makeStyles((theme) => ({
  imageButton: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  previewImage: {
    maxHeight: theme.spacing(17),
    maxWidth: theme.spacing(17),
    margin: "auto",
  },
}));

const ImageUpload = (props) => {
  const classes = useStyle();
  const [previewUrl, setPreviewUrl] = useState();
  const { file } = props;
  const filePickerRef = useRef();

  useEffect(() => {
    if (!file) {
      setPreviewUrl(file);
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickedHandler = (event) => {
    let pickedFile;
    let fileIsValid = false;
    if (event.target.files[0] || event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      fileIsValid = true;
    } else {
      setPreviewUrl(undefined);
    }
    props.onInput(props.id, pickedFile, fileIsValid);
  };
  const pickImageHandler = () => {
    filePickerRef.current.click();
  };
  return (
    <React.Fragment>
      <input
        id={props.id}
        style={{ display: "none" }}
        type="file"
        accept=".jpg,.jpeg"
        ref={filePickerRef}
        onChange={pickedHandler}
      ></input>
      {previewUrl && (
        <img src={previewUrl} alt="Preview" className={classes.previewImage} />
      )}
      {!previewUrl && (
        <Typography variant="p">
          Elegi una imagen (Debe ser JPG o JPEG):
        </Typography>
      )}
      <Button
        onClick={pickImageHandler}
        variant="contained"
        color="primary"
        className={classes.imageButton}
      >
        Seleccionar imagen
      </Button>
    </React.Fragment>
  );
};

export default ImageUpload;
