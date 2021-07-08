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
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@material-ui/core";
import { useForm, Controller } from "react-hook-form";
import { useApi } from "../../hooks/useApi";
import Constant from "../../helpers/constant";
import { getQueryString } from "../../helpers/utils";
import CircularProgress from "../../components/CircularProgress";

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
  rootSelect: {
    display: "flex",
    alignItems: "center",
    padding: 7,
  },
}));

export default function MainDetail({ defaultValues }) {
  const classes = useStyles();
  const history = useHistory();
  const id = getQueryString("id");
  const [detail, setDetail] = useState({});
  const [banks, setBanks] = useState([]);
  const [selectedType, setSelectedType] = React.useState("CASH");
  const [selectedBank, setSelectedBank] = useState(
    defaultValues?.bank.value || 1,
  );
  const { control, handleSubmit, errors, reset } = useForm();

  const addCashRequest = useApi({
    method: "post",
    url: `cashdesk`,
  });
  const editCashRequest = useApi({
    method: "put",
    url: `cashdesk/${id}`,
  });
  const detailCashRequest = useApi({
    method: "get",
    url: `cashdesk/${id}`,
  });
  const getBankRequest = useApi({
    method: "get",
    url: `bank`,
  });

  const handleChangeType = (event) => {
    setSelectedType(event.target.value);
  };

  const onSubmit = async (data) => {
    if (id) {
      await editCashRequest.execute(data);
    } else {
      await addCashRequest.execute(data);
    }
    setTimeout(() => {
      onReject();
    }, 1000);
  };

  const onReject = () => {
    history.push("/app/cash-list");
  };

  const getDetail = async () => {
    const detail = await detailCashRequest.execute();
    setDetail(detail.data);
    setSelectedBank(detail.data.bankId);
    setSelectedType(detail.data.type);
  };

  const onChangeBank = (e) => {
    setSelectedBank(e.target.value);
  };

  const getBanks = async () => {
    const result = await getBankRequest.execute();
    setBanks(result.data);
  };

  const onDone = (data) => {
    const value = {
      ...data,
      bankId: selectedBank,
      type: selectedType,
      isUpdate: !!defaultValues,
    };
    onSubmit(value);
  };

  useEffect(() => {
    if (id) {
      getDetail();
    }
    getBanks();
  }, []);

  useEffect(() => {
    reset(detail);
  }, [reset, detail]);

  return (
    <form onSubmit={handleSubmit(onDone)}>
      {!detailCashRequest.pending ? (
        <Grid item lg={6} sm={12} className={classes.root}>
          <Paper className={classes.paper}>
            <Typography
              className={classes.title}
              variant="h6"
              id="tableTitle"
              component="div"
            >
              {id ? "ویرایش صندوق" : "افزودن صندوق"}
            </Typography>

            <Grid container spacing={3}>
              <Fragment>
                <Grid item lg={12} xs={12}>
                  <RadioGroup
                    aria-label="gender"
                    name="gender1"
                    value={selectedType}
                    onChange={handleChangeType}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-around",
                    }}
                  >
                    <FormControlLabel
                      disabled={!!id}
                      value="CASH"
                      control={<Radio />}
                      label="نقدی"
                    />
                    <FormControlLabel
                      disabled={!!id}
                      value="BANK"
                      control={<Radio />}
                      label="بانکی"
                    />
                  </RadioGroup>
                </Grid>
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
                          disabled={!!id}
                          variant="outlined"
                          label="موجودی "
                          type="number"
                          name={name}
                          onChange={onChange}
                          value={value}
                          error={!!errors.amount}
                          helperText={
                            errors.amount ? errors.amount.message : ""
                          }
                          fullWidth
                          size="small"
                        />
                      );
                    }}
                    rules={{ required: Constant.VALIDATION.REQUIRED }}
                    name="amount"
                  />
                </Grid>
                {selectedType === "BANK" && (
                  <>
                    <Grid item lg={6} xs={12}>
                      <TextField
                        select
                        label="بانک"
                        onChange={onChangeBank}
                        value={selectedBank}
                        variant="outlined"
                        fullWidth
                        size="small"
                        name="bank"
                        SelectProps={{
                          classes: {
                            select: classes.rootSelect,
                          },
                        }}
                      >
                        {banks.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            <img
                              src={`${Constant.API_ADDRESS}/${option.logo}`}
                              alt={option.label}
                              style={{
                                width: 25,
                                height: 25,
                                borderRadius: "50%",
                                marginLeft: 10,
                              }}
                            />
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item lg={6} xs={12}>
                      <Controller
                        control={control}
                        render={({ onChange, value, name }) => {
                          return (
                            <TextField
                              fullWidth
                              value={value}
                              size="small"
                              name={name}
                              label="شماره کارت"
                              variant="outlined"
                              onChange={onChange}
                              error={!!errors.accountCardNumber}
                              helperText={
                                errors.accountCardNumber
                                  ? errors.accountCardNumber.message
                                  : ""
                              }
                            />
                          );
                        }}
                        rules={{
                          minLength: {
                            value: 16,
                            message: Constant.VALIDATION.CARD_NUMBER,
                          },
                          maxLength: {
                            value: 16,
                            message: Constant.VALIDATION.CARD_NUMBER,
                          },
                        }}
                        name="accountCardNumber"
                      />
                    </Grid>
                    <Grid item lg={6} xs={12}>
                      <Controller
                        control={control}
                        render={({ onChange, value, name }) => {
                          return (
                            <TextField
                              fullWidth
                              value={value}
                              size="small"
                              name={name}
                              label="شماره حساب"
                              variant="outlined"
                              onChange={onChange}
                              error={!!errors.accountNumber}
                              helperText={
                                errors.accountNumber
                                  ? errors.accountNumber.message
                                  : ""
                              }
                            />
                          );
                        }}
                        name="accountNumber"
                      />
                    </Grid>
                    <Grid item lg={6} xs={12}>
                      <Controller
                        control={control}
                        render={({ onChange, value, name }) => {
                          return (
                            <TextField
                              fullWidth
                              value={value}
                              size="small"
                              name={name}
                              label="شماره شبا"
                              variant="outlined"
                              onChange={onChange}
                              error={!!errors.accountShaba}
                              helperText={
                                errors.accountShaba
                                  ? errors.accountShaba.message
                                  : ""
                              }
                            />
                          );
                        }}
                        name="accountShaba"
                      />
                    </Grid>
                  </>
                )}
                <Grid item xs={12}>
                  <Controller
                    control={control}
                    render={({ onChange, value, name }) => {
                      return (
                        <TextField
                          multiline
                          variant="outlined"
                          label="توضیحات"
                          name={name}
                          onChange={onChange}
                          value={value}
                          error={!!errors.description}
                          helperText={
                            errors.description ? errors.description.message : ""
                          }
                          fullWidth
                          size="small"
                        />
                      );
                    }}
                    name="description"
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
