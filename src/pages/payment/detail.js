import React, { Fragment, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Paper, Typography, TextField, Button } from "@material-ui/core";
import { useForm, Controller } from "react-hook-form";
import { useApi } from "../../hooks/useApi";
import Constant from "../../helpers/constant";
import { getQueryString } from "../../helpers/utils";
import CircularProgress from "../../components/CircularProgress";
import DialogActions from "../../redux/actions/dialogAction";
import PersonSelector from "./personSelector";

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
  const [detail, setDetail] = useState({});
  const { control, handleSubmit, errors, reset } = useForm();

  const addPaymentRequest = useApi({
    method: "post",
    url: `payment`,
  });
  const editPaymentRequest = useApi({
    method: "put",
    url: `payment/${id}`,
  });
  const detailPaymentRequest = useApi({
    method: "get",
    url: `payment/${id}`,
  });

  const onSelectPerson = (person) => {
    console.log(person);
  };

  const onDismissPerson = (person) => {
    DialogActions.hide();
  };

  const onShowDialog = (data) => {
    DialogActions.show({
      title: "انتخاب شخص",
      component: (
        <PersonSelector onSubmit={onSelectPerson} onDismiss={onDismissPerson} />
      ),
      size: "xs",
      confirm: false,
      disableCloseButton: true,
    });
  };

  const onSubmit = async (data) => {
    if (id) {
      await editPaymentRequest.execute(data);
    } else {
      await addPaymentRequest.execute(data);
    }
  };

  const onReject = () => {
    history.push("/app/payment-list");
  };

  const getDetail = async () => {
    const detail = await detailPaymentRequest.execute();
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
      {!detailPaymentRequest.pending ? (
        <Grid item lg={8} sm={12} className={classes.root}>
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
                          aria-readonly
                          variant="outlined"
                          label="نام طرف"
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
                          error={!!errors.paymentname}
                          helperText={
                            errors.paymentname ? errors.paymentname.message : ""
                          }
                          fullWidth
                          size="small"
                        />
                      );
                    }}
                    rules={{ required: Constant.VALIDATION.REQUIRED }}
                    name="paymentname"
                  />
                </Grid>

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
