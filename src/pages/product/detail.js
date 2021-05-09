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
  Tooltip,
  IconButton,
} from "@material-ui/core";
import { useForm, Controller } from "react-hook-form";
import { useApi } from "../../hooks/useApi";
import Constant from "../../helpers/constant";
import { getQueryString } from "../../helpers/utils";
import CircularProgress from "../../components/CircularProgress";
import clsx from "clsx";
import { v4 as uuidv4 } from "uuid";

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
  deleteIcon: {
    color: theme.palette.error.main,
  },
}));

export default function MainDetail() {
  const classes = useStyles();
  const history = useHistory();
  const id = getQueryString("id");
  const [detail, setDetail] = useState({});
  const [amountArray, setAmountArray] = useState([]);
  const { control, handleSubmit, errors, reset } = useForm();

  const addProductRequest = useApi({
    method: "post",
    url: `product`,
  });
  const editProductRequest = useApi({
    method: "put",
    url: `product/${id}`,
  });
  const detailProductRequest = useApi({
    method: "get",
    url: `product/${id}`,
  });

  const onAddAmount = function () {
    const randomId = uuidv4();
    const onDelete = (id) => {
      console.log(id, amountArray);
      // setAmountArray(
      //   amountArray.filter((item) => item.id !== randomId),
      // );
    };
    const newAmount = (
      <Fragment>
        <Grid item lg={3} xs={12}>
          <Controller
            control={control}
            render={({ onChange, value, name }) => {
              return (
                <TextField
                  variant="outlined"
                  label="موجودی اول دوره"
                  name={name}
                  onChange={onChange}
                  value={value}
                  error={!!errors.amount}
                  helperText={errors.amount ? errors.amount.message : ""}
                  fullWidth
                  size="small"
                  type="number"
                />
              );
            }}
            rules={{ required: Constant.VALIDATION.REQUIRED }}
            name="amount"
          />
        </Grid>
        <Grid item lg={4} xs={12}>
          <Controller
            control={control}
            render={({ onChange, value, name }) => {
              return (
                <TextField
                  select
                  label="واحد"
                  value={value}
                  onChange={onChange}
                  variant="outlined"
                  name={name}
                  error={!!errors.unit}
                  helperText={errors.unit ? errors.unit.message : ""}
                  fullWidth
                  size="small"
                >
                  {currencies.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              );
            }}
            rules={{ required: Constant.VALIDATION.REQUIRED }}
            name="unit"
          />
        </Grid>
        <Grid item lg={4} xs={12}>
          <Controller
            control={control}
            render={({ onChange, value, name }) => {
              return (
                <TextField
                  select
                  label="انبار"
                  value={value}
                  onChange={onChange}
                  variant="outlined"
                  name={name}
                  error={!!errors.stock}
                  helperText={errors.stock ? errors.stock.message : ""}
                  fullWidth
                  size="small"
                >
                  {currencies.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              );
            }}
            rules={{ required: Constant.VALIDATION.REQUIRED }}
            name="stock"
          />
        </Grid>
        <Grid item lg={1} xs={12}>
          <Tooltip title="جستجو در جدول">
            <IconButton
              id={randomId}
              aria-label="filter list"
              onClick={() => onDelete(randomId)}
            >
              <i className={clsx("material-icons-round", classes.deleteIcon)}>
                clear
              </i>
            </IconButton>
          </Tooltip>
        </Grid>
      </Fragment>
    );

    setAmountArray([...amountArray, { element: newAmount, id: randomId }]);
  };

  const onSubmit = async (data) => {
    console.log(data);
    if (id) {
      return await editProductRequest.execute(data);
    }
    await addProductRequest.execute(data);
  };

  const onReject = () => {
    history.push("/app/product-list");
  };

  const getDetail = async () => {
    const detail = await detailProductRequest.execute();
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
      {!detailProductRequest.pending ? (
        <Grid item lg={6} sm={12} className={classes.root}>
          <Paper className={classes.paper}>
            <Typography
              className={classes.title}
              variant="h6"
              id="tableTitle"
              component="div"
            >
              {id ? "ویرایش کالا" : "افزودن کالا"}
            </Typography>

            <Grid container spacing={3} alignItems="center">
              <Fragment>
                <Grid item lg={6} xs={12} className={classes.datePicker}>
                  <Controller
                    control={control}
                    render={({ onChange, value, name }) => {
                      return (
                        <TextField
                          variant="outlined"
                          label="نام "
                          name={name}
                          onChange={onChange}
                          value={value}
                          error={!!errors.name}
                          helperText={errors.name ? errors.name.message : ""}
                          fullWidth
                          size="small"
                        />
                      );
                    }}
                    rules={{ required: Constant.VALIDATION.REQUIRED }}
                    name="name"
                  />
                </Grid>
                <Grid item lg={6} xs={12}>
                  <Controller
                    control={control}
                    render={({ onChange, value, name }) => {
                      return (
                        <TextField
                          select
                          label="واحد شمارش"
                          value={value}
                          onChange={onChange}
                          variant="outlined"
                          name={name}
                          error={!!errors.unitBase}
                          helperText={
                            errors.unitBase ? errors.unitBase.message : ""
                          }
                          fullWidth
                          size="small"
                        >
                          {currencies.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      );
                    }}
                    rules={{ required: Constant.VALIDATION.REQUIRED }}
                    name="unitBase"
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
                          error={!!errors.category}
                          helperText={
                            errors.category ? errors.category.message : ""
                          }
                          fullWidth
                          size="small"
                        >
                          {currencies.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      );
                    }}
                    rules={{ required: Constant.VALIDATION.REQUIRED }}
                    name="category"
                  />
                </Grid>
                <Grid item lg={6} xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={onAddAmount}
                  >
                    افزودن موجودی اول دوره
                  </Button>
                </Grid>
                {amountArray.map((item, index) => {
                  return item.element;
                })}
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
