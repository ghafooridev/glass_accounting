import React from "react";
import { useSelector } from "react-redux";
import dialogAction from "../../redux/actions/dialogAction";
import { Grid, Dialog, Typography, Button } from "@material-ui/core";
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
    confirm,
    name,
  } = useSelector((state) => state.dialog);

  const onClose = function () {
    dialogAction.hide(name);
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
      {!confirm && (
        <Grid item xs={12} className={classes.container}>
          {component && React.cloneElement(component, { onAction })}
        </Grid>
      )}
      {confirm && (
        <Grid item xs={12} className={classes.confirm}>
          <Button variant="contained" color="primary" onClick={onAction}>
            تایید
          </Button>
        </Grid>
      )}
    </Dialog>
  );
};

export default Modal;
