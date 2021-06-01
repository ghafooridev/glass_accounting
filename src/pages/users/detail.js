import React, { Fragment, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
} from "@material-ui/core";
import { useForm, Controller } from "react-hook-form";
import { useApi } from "../../hooks/useApi";
import Constant from "../../helpers/constant";
import clsx from "clsx";
import { getQueryString } from "../../helpers/utils";
import CircularProgress from "../../components/CircularProgress";
import DialogActions from "../../redux/actions/dialogAction";
import Permission from "./permission";
import dialogAction from "../../redux/actions/dialogAction";

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

export default function MainDetail() {
  const classes = useStyles();
  const history = useHistory();
  const id = getQueryString("id");
  const action = getQueryString("action");
  const [detail, setDetail] = useState({});
  const { control, handleSubmit, errors, reset } = useForm();
  const [isPassword, setIsPassword] = useState(true);
  const addUserRequest = useApi({
    method: "post",
    url: `user`,
  });
  const editUserRequest = useApi({
    method: "put",
    url: `user/${id}`,
  });
  const detailUserRequest = useApi({
    method: "get",
    url: `user/${id}`,
  });

  const onChangeViewClick = function () {
    setIsPassword(!isPassword);
  };

  const onSubmitPermission = async (data, permissions) => {
    console.log(data, permissions);
    const value = { ...data, permissions };
    if (id) {
      await editUserRequest.execute(value);
    } else {
      await addUserRequest.execute(value);
    }
    dialogAction.hide();
  };

  const onDismissPermission = () => {
    dialogAction.hide();
  };

  const onShowPermissionDialog = (data) => {
    DialogActions.show({
      title: "دسترسی ها",
      component: (
        <Permission
          defaultPermissions={detail?.permissions}
          onSubmit={(value) => onSubmitPermission(data, value)}
          onDismiss={onDismissPermission}
        />
      ),
      size: "md",
      confirm: false,
      disableCloseButton: true,
    });
  };

  const onSubmit = (data) => {
    onShowPermissionDialog(data);
  };

  const onReject = () => {
    history.push("/app/user-list");
  };

  const getDetail = async () => {
    const detail = await detailUserRequest.execute();
    setDetail(detail.data);
  };

  useEffect(() => {
    if (id) {
      getDetail();
    }
  }, []);

  useEffect(() => {
    reset(detail);
  }, [reset, detail]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {!detailUserRequest.pending ? (
        <Grid item lg={6} sm={12} className={classes.root}>
          <Paper className={classes.paper}>
            <Typography
              className={classes.title}
              variant="h6"
              id="tableTitle"
              component="div"
            >
              {id ? "ویرایش کاربر" : "افزودن کاربر"}
            </Typography>

            <Grid container spacing={3}>
              <Fragment>
                <Grid item lg={6} xs={12}>
                  <Controller
                    control={control}
                    render={({ onChange, value, name }) => {
                      return (
                        <TextField
                          variant="outlined"
                          label="نام"
                          name={name}
                          onChange={onChange}
                          value={value}
                          error={!!errors.firstName}
                          helperText={
                            errors.firstName ? errors.firstName.message : ""
                          }
                          fullWidth
                          size="small"
                        />
                      );
                    }}
                    rules={{ required: Constant.VALIDATION.REQUIRED }}
                    name="firstName"
                  />
                </Grid>
                <Grid item lg={6} xs={12}>
                  <Controller
                    control={control}
                    render={({ onChange, value, name }) => {
                      return (
                        <TextField
                          variant="outlined"
                          label="نام خانوادگی"
                          name={name}
                          onChange={onChange}
                          value={value}
                          error={!!errors.lastName}
                          helperText={
                            errors.lastName ? errors.lastName.message : ""
                          }
                          fullWidth
                          size="small"
                        />
                      );
                    }}
                    rules={{ required: Constant.VALIDATION.REQUIRED }}
                    name="lastName"
                  />
                </Grid>
                <Grid item lg={6} xs={12}>
                  <Controller
                    control={control}
                    render={({ onChange, value, name }) => {
                      return (
                        <TextField
                          variant="outlined"
                          label="نام کاربری"
                          name={name}
                          onChange={onChange}
                          value={value}
                          error={!!errors.username}
                          helperText={
                            errors.username ? errors.username.message : ""
                          }
                          fullWidth
                          size="small"
                        />
                      );
                    }}
                    rules={{ required: Constant.VALIDATION.REQUIRED }}
                    name="username"
                  />
                </Grid>
                {action === "add" && (
                  <Grid item lg={6} xs={12}>
                    <Controller
                      control={control}
                      render={({ onChange, value, name }) => {
                        return (
                          <TextField
                            variant="outlined"
                            label="رمز عبور"
                            name={name}
                            onChange={onChange}
                            value={value}
                            error={!!errors.password}
                            helperText={
                              errors.password ? errors.password.message : ""
                            }
                            fullWidth
                            size="small"
                            type={isPassword ? "password" : "text"}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <i
                                    style={{ cursor: "pointer" }}
                                    className={clsx(
                                      "material-icons-round",
                                      classes.icon,
                                    )}
                                    onClick={onChangeViewClick}
                                  >
                                    {isPassword
                                      ? "visibility_off"
                                      : "visibility"}
                                  </i>
                                </InputAdornment>
                              ),
                            }}
                          />
                        );
                      }}
                      rules={{
                        required: Constant.VALIDATION.REQUIRED,
                        minLength: {
                          value: 5,
                          message: Constant.VALIDATION.PASSWORD,
                        },
                      }}
                      name="password"
                    />
                  </Grid>
                )}
                <Grid item lg={6} xs={12}>
                  <Controller
                    control={control}
                    render={({ onChange, value, name }) => {
                      return (
                        <TextField
                          variant="outlined"
                          label="موبایل"
                          name={name}
                          onChange={onChange}
                          value={value}
                          error={!!errors.mobile}
                          helperText={
                            errors.mobile ? errors.mobile.message : ""
                          }
                          fullWidth
                          size="small"
                        />
                      );
                    }}
                    rules={{
                      minLength: {
                        value: 11,
                        message: Constant.VALIDATION.MOBILE_NUMBER,
                      },
                      maxLength: {
                        value: 11,
                        message: Constant.VALIDATION.MOBILE_NUMBER,
                      },
                    }}
                    name="mobile"
                  />
                </Grid>
                <Grid item lg={6} xs={12}>
                  <Controller
                    control={control}
                    render={({ onChange, value, name }) => {
                      return (
                        <TextField
                          variant="outlined"
                          label="تلفن"
                          name={name}
                          onChange={onChange}
                          value={value}
                          error={!!errors.phone}
                          helperText={errors.phone ? errors.phone.message : ""}
                          fullWidth
                          size="small"
                        />
                      );
                    }}
                    name="phone"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    control={control}
                    render={({ onChange, value, name }) => {
                      return (
                        <TextField
                          variant="outlined"
                          label="آدرس"
                          name={name}
                          onChange={onChange}
                          value={value}
                          error={!!errors.address}
                          helperText={
                            errors.address ? errors.address.message : ""
                          }
                          fullWidth
                          size="small"
                        />
                      );
                    }}
                    name="address"
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Button variant="contained" color="primary" type="submit">
                    تایید
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={onReject}
                  >
                    بازگشت
                  </Button>
                </Grid>
              </Fragment>
            </Grid>
          </Paper>
        </Grid>
      ) : (
        <CircularProgress />
      )}
    </form>
  );
}
