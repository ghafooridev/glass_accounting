import React, { useState, useEffect } from "react";
import { TextField, Button, Grid, MenuItem } from "@material-ui/core";
import { useApi } from "../../hooks/useApi";
import { useForm, Controller } from "react-hook-form";
import Constant from "../../helpers/constant";
import styles from "./style";
import { v4 as uuid } from "uuid";

const Account = ({ onSubmit, onDismiss, defaultValues }) => {
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState(
    defaultValues?.bank.value || 1,
  );
  const { control, handleSubmit, errors, reset } = useForm();
  const classes = styles();

  const getBankRequest = useApi({
    method: "get",
    url: `bank`,
  });

  const getBanks = async () => {
    const result = await getBankRequest.execute();
    setBanks(result.data);
  };

  const getSelectedBank = () => {
    return banks.find((item) => item.value === selectedBank);
  };

  const onDone = (data) => {
    const newId = uuid();
    const value = {
      ...data,
      bank: getSelectedBank(),
      id: defaultValues ? defaultValues.id : newId,
      isUpdate: !!defaultValues,
    };
    onSubmit(value);
  };

  const onChangeBank = (e) => {
    setSelectedBank(e.target.value);
  };

  useEffect(() => {
    getBanks();
  }, []);

  useEffect(() => {
    reset(defaultValues);
  }, [reset, defaultValues]);

  return (
    <Grid container spacing={3}>
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
                fullWidth
                value={value}
                size="small"
                name={name}
                label="شماره کارت"
                variant="outlined"
                onChange={onChange}
                error={!!errors.cardNumber}
                helperText={errors.cardNumber ? errors.cardNumber.message : ""}
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
          name="cardNumber"
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          control={control}
          render={({ onChange, value, name }) => {
            return (
              <TextField
                fullWidth
                value={value}
                size="small"
                name={name}
                label="شمار حساب"
                variant="outlined"
                onChange={onChange}
                error={!!errors.accountNumber}
                helperText={
                  errors.accountNumber ? errors.accountNumber.message : ""
                }
              />
            );
          }}
          name="accountNumber"
        />
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
        <Button variant="contained" color="primary" onClick={onDismiss}>
          انصراف
        </Button>
      </Grid>
    </Grid>
  );
};

export default Account;
