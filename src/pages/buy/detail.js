import React, { Fragment, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Paper, Typography, TextField, Button } from "@material-ui/core";
import { useForm, Controller } from "react-hook-form";
import { useApi } from "../../hooks/useApi";
import Constant from "../../helpers/constant";
import { getQueryString } from "../../helpers/utils";
import CircularProgress from "../../components/CircularProgress";
import { DatePicker } from "@material-ui/pickers";
import moment from "moment";

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
  datePicker: {
    "& input": {
      padding: "10px 14px",
    },
  },
}));

export default function MainDetail() {
  const classes = useStyles();
  const history = useHistory();
  const id = getQueryString("id");
  const [detail, setDetail] = useState({});
  const { control, handleSubmit, errors, reset } = useForm();
  const addBuyRequest = useApi({
    method: "post",
    url: `buy`,
  });
  const editBuyRequest = useApi({
    method: "put",
    url: `buy/${id}`,
  });
  const detailBuyRequest = useApi({
    method: "get",
    url: `buy/${id}`,
  });

  const onSubmit = async (data) => {
    console.log(data);
    let d = new Date().toISOString();
    alert(d);
    console.log(selectedDate);
    // if (id) {
    //   return await editBuyRequest.execute(data);
    // }
    // await addBuyRequest.execute(data);
  };

  const onReject = () => {
    history.push("/app/buy-list");
  };

  const getDetail = async () => {
    const detail = await detailBuyRequest.execute();
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
  const [selectedDate, setSelectedDate] = useState("2015-05-11T01:56:52.501Z");
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {!detailBuyRequest.pending ? (
        <Grid item lg={6} sm={12} className={classes.root}>
          <Paper className={classes.paper}>
            <Typography
              className={classes.title}
              variant="h6"
              id="tableTitle"
              component="div"
            >
              {id ? "ویرایش فاکتور فروش" : "فاکتور فروش"}
            </Typography>

            <Grid container spacing={3}>
              <Fragment>
                <Grid item lg={6} xs={12} className={classes.datePicker}>
                  <DatePicker
                    name="date"
                    label="تاریخ ثبت"
                    inputVariant="outlined"
                    okLabel="تأیید"
                    cancelLabel="لغو"
                    labelFunc={(date) =>
                      date ? date.format("jYYYY/jMM/jDD") : ""
                    }
                    value={selectedDate}
                    onChange={setSelectedDate}
                    style={{ width: "100%" }}
                  />
                </Grid>
                <Grid item lg={6} xs={12}>
                  <Controller
                    control={control}
                    render={({ onChange, value, name }) => {
                      return (
                        <TextField
                          variant="outlined"
                          label="نام مشتری"
                          name={name}
                          onChange={onChange}
                          value={value}
                          error={!!errors.customer}
                          helperText={
                            errors.customer ? errors.customer.message : ""
                          }
                          fullWidth
                          size="small"
                        />
                      );
                    }}
                    rules={{ required: Constant.VALIDATION.REQUIRED }}
                    name="customer"
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
