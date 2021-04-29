import React from "react";
import { useSelector } from "react-redux";
import dialogAction from "../../redux/actions/dialogAction";
import { Grid, Dialog, Typography } from "@material-ui/core";
import { styles } from "./Modal.Style";

const Modal = function () {
  const classes = styles();
  const {
    show,
    component,
    title,
    onAction,
    size,
    disableCloseButton,
  } = useSelector((state) => state.dialog);

  const onClose = function () {
    dialogAction.hide();
  };

  return (
    <Dialog
      fullWidth
      maxWidth={size}
      onClose={onClose}
      aria-labelledby="simple-dialog-title"
      open={show}
      disableBackdropClick
    >
      <Grid item xs={12} className={classes.title}>
        <Typography variant="h6">{title}</Typography>
        {!disableCloseButton && (
          <i
            className="material-icons"
            onClick={onClose}
            style={{ cursor: "pointer" }}
          >
            clear
          </i>
        )}
      </Grid>
      <Grid item xs={12} className={classes.container}>
        {component && React.cloneElement(component, { onAction })}
      </Grid>
    </Dialog>
  );
};

export default Modal;
