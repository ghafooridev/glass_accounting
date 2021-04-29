import React from "react";

import { useSelector } from "react-redux";

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

import AlertAction from "../../redux/actions/AlertAction";

const Alert = function () {
  const { show, text, type } = useSelector((state) => state.alert);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    AlertAction.hide();
  };

  return (
    <Snackbar open={show} autoHideDuration={6000} onClose={handleClose}>
      <MuiAlert
        elevation={6}
        variant="filled"
        onClose={handleClose}
        severity={type}
      >
        {text}
      </MuiAlert>
    </Snackbar>
  );
};

export default Alert;
