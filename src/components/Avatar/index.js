import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";

const getRandomColor = (theme) => {
  console.log(theme.palette);
  return "red";
};

const useStyles = makeStyles((theme) => ({
  root: {
    // width: (props) => props.size,
    backgroundColor: getRandomColor(theme),
  },
}));

export default function ImageAvatars(props) {
  const { img, username } = props;
  const classes = useStyles();

  return <Avatar alt={username} src={img} className={classes.root} />;
}
