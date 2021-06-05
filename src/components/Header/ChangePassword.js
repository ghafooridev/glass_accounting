import React, { useState, useRef } from "react";
import { Grid, TextField, Button, InputAdornment } from "@material-ui/core";
import { useForm, Controller } from "react-hook-form";
import clsx from "clsx";
import Constant from "../../helpers/constant";

const MainDetail = ({ onSubmit, onDismiss }) => {
  const { control, handleSubmit, errors, reset } = useForm();
  const [isPassword, setIsPassword] = useState(true);
  const passwordRef = useRef(null);
  const onChangeViewClick = function () {
    setIsPassword(!isPassword);
  };

  const onDone = (data) => {
    onSubmit(data);
  };
  console.log(errors);
  return (
    <form onSubmit={handleSubmit(onDone)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Controller
            control={control}
            render={({ onChange, value, name }) => {
              return (
                <TextField
                  variant="outlined"
                  label=" رمز عبور قبلی"
                  name={name}
                  onChange={onChange}
                  value={value}
                  error={!!errors.prePassword}
                  helperText={
                    errors.prePassword ? errors.prePassword.message : ""
                  }
                  fullWidth
                  size="small"
                  type={"password"}
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
            name="prePassword"
          />
        </Grid>
        <Grid item xs={12}>
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
                  helperText={errors.password ? errors.password.message : ""}
                  fullWidth
                  size="small"
                  type={isPassword ? "password" : "text"}
                  inputRef={passwordRef}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <i
                          style={{ cursor: "pointer" }}
                          className={clsx("material-icons-round")}
                          onClick={onChangeViewClick}
                        >
                          {isPassword ? "visibility_off" : "visibility"}
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
        <Grid item xs={12}>
          <Controller
            control={control}
            render={({ onChange, value, name }) => {
              return (
                <TextField
                  variant="outlined"
                  label="تکرار رمز عبور "
                  name={name}
                  onChange={onChange}
                  value={value}
                  error={!!errors.repassword}
                  helperText={
                    errors.repassword && "تکرار رمز عبور با رمز عبور برابر نیست"
                  }
                  fullWidth
                  size="small"
                  type={"password"}
                />
              );
            }}
            rules={{
              validate: (value) => value === passwordRef.current.value,
            }}
            name="repassword"
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
          <Button variant="contained" color="primary" onClick={onDismiss}>
            انصراف
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default MainDetail;
