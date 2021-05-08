import React, { Fragment, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
} from "@material-ui/core";
import { useForm, Controller } from "react-hook-form";
import { useApi } from "../../hooks/useApi";
import Constant from "../../helpers/constant";
import { getQueryString } from "../../helpers/utils";
import CircularProgress from "../../components/CircularProgress";

const currencies = [
  {
    value: "USD",
    label: "$",
  },
  {
    value: "EUR",
    label: "€",
  },
  {
    value: "BTC",
    label: "฿",
  },
  {
    value: "JPY",
    label: "¥",
  },
];

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
  const [category, setCategory] = useState([]);
  const { control, handleSubmit, errors, reset } = useForm();

  const addCustomerRequest = useApi({
    method: "post",
    url: `customer`,
  });
  const editCustomerRequest = useApi({
    method: "put",
    url: `customer/${id}`,
  });
  const detailCustomerRequest = useApi({
    method: "get",
    url: `customer/${id}`,
  });

  const customerCategoryRequest = useApi({
    method: "get",
    url: `customer/category`,
  });

  const onSubmit = async (data) => {
    if (id) {
      return await editCustomerRequest.execute(data);
    }
    await addCustomerRequest.execute(data);
  };

  const onReject = () => {
    history.push("/app/customer-list");
  };

  const getDetail = async () => {
    const detail = await detailCustomerRequest.execute();
    setDetail(detail.data);
  };

  const getCustomerCategory = async () => {
    const detail = await customerCategoryRequest.execute();
    setCategory(detail.data);
  };

  useEffect(() => {
    getCustomerCategory();
    if (id) {
      getDetail();
    }
  }, []);

  useEffect(() => {
    reset(detail);
  }, [reset, detail]);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {!detailCustomerRequest.pending ? (
        <Grid item lg={6} sm={12} className={classes.root}>
          <Paper className={classes.paper}>
            <Typography
              className={classes.title}
              variant="h6"
              id="tableTitle"
              component="div"
            >
              {id ? "ویرایش مشتری" : "افزودن مشتری"}
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
                          select
                          label="دسته بندی"
                          value={value}
                          onChange={onChange}
                          variant="outlined"
                          name={name}
                          error={!!errors.customerCategory}
                          helperText={
                            errors.customerCategory
                              ? errors.customerCategory.message
                              : ""
                          }
                          fullWidth
                          size="small"
                        >
                          {category.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      );
                    }}
                    rules={{ required: Constant.VALIDATION.REQUIRED }}
                    name="customerCategory"
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
                <Grid item xs={12}>
                  <Controller
                    control={control}
                    render={({ onChange, value, name }) => {
                      return (
                        <TextField
                          label="توضیحات"
                          multiline
                          rows={4}
                          variant="outlined"
                          name={name}
                          onChange={onChange}
                          value={value}
                          fullWidth
                          error={!!errors.description}
                          helperText={
                            errors.description ? errors.description.message : ""
                          }
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
