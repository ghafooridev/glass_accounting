import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import classNames from "classnames";
const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    overflow: "hidden",
    height: "100%",
    padding: 20,
    minHeight: 150,
    cursor: "pointer",
    transition: "all 0.5s",
    backgroundColor: (props) => props.color,
  },
  icon: {
    position: "absolute",
    bottom: -20,
    left: -20,
    fontSize: 180,
    color: theme.palette.grey[100],
  },
}));

export default function SimplePaper(props) {
  const classes = useStyles(props);

  return (
    <Paper className={classes.root} onClick={props.onClick}>
      <i className={classNames("material-icons-round", classes.icon)}>
        {props.icon}
      </i>
      {props.children}
    </Paper>
  );
}
