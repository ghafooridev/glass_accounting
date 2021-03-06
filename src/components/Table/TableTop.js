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
  Collapse,
  InputAdornment,
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
  const {
    title,
    onAdd,
    FilterComponent,
    handleSearch,
    toolbarClass,
    addButtonClass,
    minimal,
    defaultSearch,
  } = props;
  const [showSearchText, setShowSearchText] = useState(!!defaultSearch);
  const [showFilterBox, setShowFilterBox] = useState(false);
  const [searchText, setSearchText] = useState(defaultSearch);

  const onChangeSearch = (event) => {
    const { value } = event.target;
    setSearchText(value);
  };

  const OnSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(searchText);
    }
  };

  const onRemoveSearch = () => {
    setSearchText("");
    handleSearch("");
  };

  return (
    <>
      <Toolbar className={clsx(classes.root, toolbarClass)}>
        <Typography variant="h6" id="tableTitle" component="div">
          {title}
        </Typography>
        <div className={classes.box}>
          {showSearchText && (
            <TextField
              value={searchText}
              size="small"
              label="جستجو"
              variant="outlined"
              onChange={onChangeSearch}
              onKeyDown={OnSearchKeyPress}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <i
                      className="material-icons-round"
                      style={{ cursor: "pointer" }}
                      onClick={onRemoveSearch}
                    >
                      clear
                    </i>
                  </InputAdornment>
                ),
              }}
            />
          )}
          {handleSearch && (
            <Tooltip title="جستجو در جدول">
              <IconButton
                aria-label="filter list"
                onClick={() => setShowSearchText(!showSearchText)}
              >
                <SearchIcon />
              </IconButton>
            </Tooltip>
          )}
          {FilterComponent && (
            <Tooltip title="فیلتر">
              <IconButton onClick={() => setShowFilterBox(!showFilterBox)}>
                <i class="material-icons-round">filter_alt</i>
              </IconButton>
            </Tooltip>
          )}

          {typeof onAdd === "function" && (
            <Button
              variant={minimal ? "" : "contained"}
              color={minimal ? "" : "primary"}
              className={addButtonClass}
              onClick={onAdd}
            >
              {minimal ? "" : "افزودن"}
              <span class="material-icons-round" style={{ color: "white" }}>
                add
              </span>
            </Button>
          )}
        </div>
      </Toolbar>
      <Collapse in={showFilterBox}>{FilterComponent}</Collapse>
    </>
  );
};

export default TableTop;
