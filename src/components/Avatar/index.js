import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: (props) => props.color(),
  },
}));

export default function ImageAvatars(props) {
  const { img, username } = props;
  const classes = useStyles(props);

  return (
    <Avatar alt={username} src={img} className={classes.root}>
      {!img && username.substring(0, 1).toUpperCase()}
    </Avatar>
  );
}
