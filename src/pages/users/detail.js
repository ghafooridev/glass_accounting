import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Paper, Typography, TextField, Button } from "@material-ui/core";

import { useApi } from "../../hooks/useApi";
import { convertParamsToQueryString } from "../../helpers/utils";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "0 auto",
  },
  paper: {
    width: "100%",
    padding: 20,
  },
  title: {
    paddingBottom: 20,
  },
}));

export default function UserList() {
  const classes = useStyles();

  const onSubmit = () => {
    console.log("submit");
  };

  const onReject = () => {
    console.log("Reject");
  };

  const userRequest = useApi({
    method: "get",
    url: `/api/users?${convertParamsToQueryString()}`,
  });

  const getData = async () => {
    const userList = await userRequest.execute();
    console.log(userList);
  };
  console.log("response", userRequest);
  useEffect(() => {
    getData();
  }, []);

  return (
    <Grid item lg={6} sm={12} className={classes.root}>
      <Paper className={classes.paper}>
        <Typography
          className={classes.title}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          افزودن کاربر
        </Typography>
        <Grid container spacing={3}>
          <Grid item lg={6} xs={12}>
            <TextField
              label="نام"
              variant="outlined"
              size="small"
              style={{ width: "100%" }}
            />
          </Grid>
          <Grid item lg={6} xs={12}>
            <TextField
              label="نام خانوادگی"
              variant="outlined"
              size="small"
              style={{ width: "100%" }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="نام خانوادگی"
              variant="outlined"
              size="small"
              style={{ width: "100%" }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="نام کاربری"
              variant="outlined"
              size="small"
              style={{ width: "100%" }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="رمز عبور"
              variant="outlined"
              size="small"
              style={{ width: "100%" }}
            />
          </Grid>
          <Grid
            item
            xs={12}
            justify="space-between"
            style={{ display: "flex" }}
          >
            <Button variant="contained" color="primary" onClick={onSubmit}>
              تایید
            </Button>
            <Button variant="contained" color="secondary" onClick={onReject}>
              انصراف
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
}
