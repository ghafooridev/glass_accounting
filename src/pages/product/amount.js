import React, { useState, useEffect } from "react";
import { TextField, Button, Grid, MenuItem } from "@material-ui/core";
import { useApi } from "../../hooks/useApi";
import { useForm, Controller } from "react-hook-form";
import Constant from "../../helpers/constant";

const Account = ({ onSubmit, onDismiss, defaultValues, units }) => {
  const [depotPicker, setDepotPicker] = useState([]);
  const [seletedUnit, setSelectedUnit] = useState(units[0].value);
  const [seletedDepot, setSelectedDepot] = useState(1);
  const { control, handleSubmit, errors, reset } = useForm();

  const getDepotRequest = useApi({
    method: "get",
    url: `depot/picker`,
  });

  const getDepotPicker = async () => {
    const result = await getDepotRequest.execute();
    setDepotPicker(result.data);
  };

  //   const onChange = (e) => {
  //     setValues({ ...values, [e.target.name]: e.target.value });
  //   };

  const onChangeDepot = (e) => {
    setSelectedDepot(e.target.value);
  };
  const onChangeUnit = (e) => {
    setSelectedUnit(e.target.value);
  };

  const onDone = (data) => {
    const value = { ...data, unit: seletedUnit, depot: seletedDepot };
    onSubmit(value);
  };

  useEffect(() => {
    getDepotPicker();
  }, []);

  useEffect(() => {
    reset(defaultValues);
  }, [reset, defaultValues]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
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
      <Grid item xs={12}>
        <TextField
          select
          label="واحد"
          value={seletedUnit}
          onChange={onChangeUnit}
          variant="outlined"
          name="unit"
          fullWidth
          size="small"
        >
          {units.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12}>
        <TextField
          select
          label="انبار"
          value={seletedDepot}
          onChange={onChangeDepot}
          variant="outlined"
          name="depot"
          fullWidth
          size="small"
        >
          {depotPicker.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
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
