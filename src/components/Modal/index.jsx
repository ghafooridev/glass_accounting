import React from "react";
import { useSelector } from "react-redux";
import dialogAction from "../../redux/actions/dialogAction";
import { Grid, Grow, Typography, Button } from "@material-ui/core";
import { styles } from "./Modal.Style";

const Modal = function () {
  const classes = styles();
  const { names } = useSelector((state) => state.dialog);

  const onClose = function (item) {
    dialogAction.hide({ name: "delete" });
  };

  return (
    // <Dialog
    //   fullWidth
    //   maxWidth={size}
    //   onClose={onClose}
    //   aria-labelledby="simple-dialog-title"
    //   open={x()}
    //   disableBackdropClick
    // >
    <div className={classes.overlay}>
      {names.map((item) => (
        <Grow in={true}>
          <Grid
            xs={12}
            sm={Number(item.size)}
            container
            style={{
              boxShadow: "0 3px 10px rgb(0 0 0 / 0.2)",
              borderRadius: 5,
              padding: 20,
              position: "fixed",
              zIndex: 1000,
              top: "50%",
              backgroundColor: "#fff",
              left: "50%",
              transform: "translate(-50%,-50%)",
            }}
          >
            <Grid item xs={12} className={classes.title}>
              <Typography variant="h6">{item.title}</Typography>
              {/* {!item.disableCloseButton && (
              <i
                className="material-icons"
                onClick={() => onClose(item)}
                style={{ cursor: "pointer" }}
              >
                clear
              </i>
            )} */}
            </Grid>
            {!item.confirm && (
              <Grid item xs={12} className={classes.container}>
                {item.component}
              </Grid>
            )}
            {item.confirm && (
              <Grid
                item
                xs={12}
                className={classes.confirm}
                style={{ justifyContent: "space-between" }}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => onClose(item)}
                >
                  انصراف
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={item.onAction}
                >
                  تایید
                </Button>
              </Grid>
            )}
          </Grid>
        </Grow>
      ))}
    </div>
  );
};

export default Modal;
