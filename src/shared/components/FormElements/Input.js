import { TextField, makeStyles } from "@material-ui/core";
import React, { useReducer, useEffect } from "react";

import { validate } from "../../util/input-validators";

const useStyle = makeStyles((theme) => ({
  input: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));
const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.value,
        isValid: validate(action.value, action.validators),
      };
    case "TOUCH": {
      return {
        ...state,
        isTouched: true,
      };
    }
    default:
      return state;
  }
};

const Input = (props) => {
  const classes = useStyle();
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.value || "",
    isTouched: false,
    isValid: props.valid || false,
  });

  const { id, onInput } = props;
  const { value, isValid } = inputState;

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, onInput, value, isValid]);
  const changeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      value: event.target.value,
      validators: props.validators,
    });
  };

  const touchHandler = () => {
    dispatch({ type: "TOUCH" });
  };

  let element;
  switch (props.element) {
    case "input":
      element = (
        <TextField
          id={props.id}
          type={props.type}
          placeholder={props.placeholder}
          onChange={changeHandler}
          onBlur={touchHandler}
          value={props.value}
          disabled={props.disabled}
          className={classes.input}
        />
      );
      break;
    case "textarea":
      element = (
        <TextField
          id={props.id}
          multiline
          variant="outlined"
          rows={props.rows || 4}
          onChange={changeHandler}
          onBlur={touchHandler}
          value={props.value}
          className={classes.input}
        />
      );
      break;
    case "select":
      element = (
        <select
          id={props.id}
          onChange={changeHandler}
          onBlur={touchHandler}
          value={inputState.value}
          className={classes.input}
        >
          {props.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.displayValue}
            </option>
          ))}
        </select>
      );
      break;
    default:
      element = null;
  }
  return element;
};

export default Input;
