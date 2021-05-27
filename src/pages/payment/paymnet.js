import React, { useState, useEffect } from "react";
import { TextField, Button, Grid, MenuItem } from "@material-ui/core";
import { useApi } from "../../hooks/useApi";
import { useForm, Controller } from "react-hook-form";
import moment from "moment";
import { DatePicker } from "@material-ui/pickers";
import Constant from "../../helpers/constant";
import styles from "./style";
import { v4 as uuid } from "uuid";

const Payment = ({ onSubmit, onDismiss, defaultValues, paymentType, type }) => {
  const [banks, setBanks] = useState([]);
  const [chequeDueDate, handleChequeDueDateChange] = useState(moment());
  const [selectedTransaction, setSelectedTransaction] = useState("CARD");
  const [selectedBank, setSelectedBank] = useState(defaultValues?.bankId || 1);
  const [cashes, setCashes] = useState([]);
  const [selectedCash, setSelectedCash] = useState(
    defaultValues?.cashDeskId || 5,
  );
  const { control, handleSubmit, errors, reset } = useForm();
  const classes = styles();

  const getBankRequest = useApi({
    method: "get",
    url: `bank`,
  });

  const getCashRequest = useApi({
    method: "get",
    url: `cashdesk/picker`,
  });

  const getBanks = async () => {
    const result = await getBankRequest.execute();
    setBanks(result.data);
  };

  const getCashes = async () => {
    const result = await getCashRequest.execute();
    setCashes(result.data);
  };

  const getSelectedBank = () => {
    return banks.find((item) => item.value === selectedBank);
  };

  const getSelectedCash = () => {
    return cashes.find((item) => item.value === selectedCash);
  };

  const onDone = (data) => {
    const newId = uuid();
    let value;
    if (type === "NAGHD") {
      value = {
        ...data,
        id: defaultValues ? defaultValues.id : newId,
        cashDeskId: selectedCash,
        cashDesk: getSelectedCash(),
        isUpdate: !!defaultValues,
      };
    } else if (type === "CARD") {
      value = {
        ...data,
        id: defaultValues ? defaultValues.id : newId,
        cashDeskId: selectedCash,
        bankId: selectedBank,
        cashDesk: getSelectedCash(),
        bank: getSelectedBank(),
        bankTransactionType: selectedTransaction,
        isUpdate: !!defaultValues,
      };
    } else {
      value = {
        ...data,
        id: defaultValues ? defaultValues.id : newId,
        cashDeskId: selectedCash,
        bankId: selectedBank,
        cashDesk: getSelectedCash(),
        bank: getSelectedBank(),
        chequeDueDate: chequeDueDate._d,
        isUpdate: !!defaultValues,
      };
    }
    console.log(onSubmit);
    return onSubmit(value, type, !!defaultValues);
  };

  const onChangeBank = (e) => {
    setSelectedBank(e.target.value);
  };

  const onChangeTransaction = (e) => {
    setSelectedTransaction(e.target.value);
  };

  const onChangeCash = (e) => {
    setSelectedCash(e.target.value);
  };

  useEffect(() => {
    getBanks();
    getCashes();
  }, []);

  useEffect(() => {
    reset(defaultValues);
  }, [reset, defaultValues]);

  return (
    <form onSubmit={handleSubmit(onDone)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {type === "NAGHD" && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  select
                  label="صندوق"
                  onChange={onChangeCash}
                  value={selectedCash}
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="cash"
                >
                  {cashes.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Controller
                  control={control}
                  render={({ onChange, value, name }) => {
                    return (
                      <TextField
                        variant="outlined"
                        label="مبلغ نقدی"
                        type="number"
                        name={name}
                        onChange={onChange}
                        value={value}
                        error={!!errors.price}
                        helperText={errors.price ? errors.price.message : ""}
                        fullWidth
                        size="small"
                      />
                    );
                  }}
                  name="price"
                />
              </Grid>
            </Grid>
          )}
          {type === "CARD" && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  select
                  label="صندوق"
                  onChange={onChangeCash}
                  value={selectedCash}
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="cash"
                >
                  {cashes.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  label="نوع تراکنش"
                  onChange={onChangeTransaction}
                  value={selectedTransaction}
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="cash"
                >
                  {Constant.BANK_TRANSACTION_TYPE.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Controller
                  control={control}
                  render={({ onChange, value, name }) => {
                    return (
                      <TextField
                        variant="outlined"
                        label="مبلغ "
                        type="number"
                        name={name}
                        onChange={onChange}
                        value={value}
                        error={!!errors.price}
                        helperText={errors.price ? errors.price.message : ""}
                        fullWidth
                        size="small"
                      />
                    );
                  }}
                  rules={{ required: Constant.VALIDATION.REQUIRED }}
                  name="price"
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  control={control}
                  render={({ onChange, value, name }) => {
                    return (
                      <TextField
                        variant="outlined"
                        label="شماره رهگیری"
                        number
                        name={name}
                        onChange={onChange}
                        value={value}
                        error={!!errors.trackingCode}
                        helperText={
                          errors.trackingCode ? errors.trackingCode.message : ""
                        }
                        fullWidth
                        size="small"
                      />
                    );
                  }}
                  name="trackingCode"
                />
              </Grid>
              <Grid item xs={12}>
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
            </Grid>
          )}
          {type === "CHECK" && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  select
                  label="صندوق"
                  onChange={onChangeCash}
                  value={selectedCash}
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="cash"
                >
                  {cashes.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Controller
                  control={control}
                  render={({ onChange, value, name }) => {
                    return (
                      <TextField
                        variant="outlined"
                        label="مبلغ چک"
                        type="number"
                        name={name}
                        onChange={onChange}
                        value={value}
                        error={!!errors.price}
                        helperText={errors.price ? errors.price.message : ""}
                        fullWidth
                        size="small"
                      />
                    );
                  }}
                  rules={{ required: Constant.VALIDATION.REQUIRED }}
                  name="price"
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  control={control}
                  render={({ onChange, value, name }) => {
                    return (
                      <TextField
                        variant="outlined"
                        label="شماره چک"
                        number
                        name={name}
                        onChange={onChange}
                        value={value}
                        error={!!errors.chequeNumber}
                        helperText={
                          errors.chequeNumber ? errors.chequeNumber.message : ""
                        }
                        fullWidth
                        size="small"
                      />
                    );
                  }}
                  name="chequeNumber"
                />
              </Grid>
              <Grid item xs={12}>
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
              <Grid item xs={12}>
                <Controller
                  control={control}
                  render={({ onChange, value, name }) => {
                    return (
                      <TextField
                        variant="outlined"
                        label="شعبه"
                        number
                        name={name}
                        onChange={onChange}
                        value={value}
                        error={!!errors.bankBranch}
                        helperText={
                          errors.bankBranch ? errors.bankBranch.message : ""
                        }
                        fullWidth
                        size="small"
                      />
                    );
                  }}
                  name="bankBranch"
                />
              </Grid>
              <Grid item xs={12} className={classes.datePicker}>
                <DatePicker
                  name="date"
                  label="تاریخ سررسید"
                  inputVariant="outlined"
                  okLabel="تأیید"
                  cancelLabel="لغو"
                  labelFunc={(date) =>
                    date ? date.format("jYYYY/jMM/jDD") : ""
                  }
                  value={chequeDueDate}
                  onChange={handleChequeDueDateChange}
                  style={{ width: "100%" }}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  control={control}
                  render={({ onChange, value, name }) => {
                    return (
                      <TextField
                        variant="outlined"
                        label="در وجه"
                        number
                        name={name}
                        onChange={onChange}
                        value={value}
                        error={!!errors.chequePayTo}
                        helperText={
                          errors.chequePayTo ? errors.chequePayTo.message : ""
                        }
                        fullWidth
                        size="small"
                      />
                    );
                  }}
                  name="chequePayTo"
                />
              </Grid>
            </Grid>
          )}
        </Grid>

        <Grid
          item
          xs={12}
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <Button
            variant="contained"
            color="primary"
            type="submit"
            onClick={handleSubmit(onDone)}
          >
            تایید
          </Button>
          <Button variant="contained" color="secondary" onClick={onDismiss}>
            انصراف
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default Payment;
