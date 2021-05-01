import React, { useState } from "react";
import clsx from "clsx";
import { lighten, makeStyles } from "@material-ui/core/styles";
import {
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  TextField,
  Button,
} from "@material-ui/core";

import SearchIcon from "@material-ui/icons/SearchRounded";

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  box: {
    display: "flex",
    alignItems: "center",
  },
}));

const TableTop = (props) => {
  const classes = useToolbarStyles();
  const { title, onAdd } = props;
  const [showSearchText, setShowSearchText] = useState(false);

  return (
    <Toolbar className={clsx(classes.root, {})}>
      <Typography
        className={classes.title}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        {title}
      </Typography>
      <div className={classes.box}>
        {showSearchText && (
          <TextField size="small" label="جستجو" variant="outlined" />
        )}
        <Tooltip title="جستجو در جدول">
          <IconButton
            aria-label="filter list"
            onClick={() => setShowSearchText(!showSearchText)}
          >
            <SearchIcon />
          </IconButton>
        </Tooltip>
        {typeof onAdd === "function" && (
          <Button variant="contained" color="primary">
            افزودن
            <span class="material-icons-round">add</span>
          </Button>
        )}
      </div>
    </Toolbar>
  );
};

export default TableTop;
