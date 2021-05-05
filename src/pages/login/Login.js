import React, { useState } from "react";
import {
  Grid,
  CircularProgress,
  Typography,
  Button,
  TextField,
  Divider,
} from "@material-ui/core";
import { withRouter } from "react-router-dom";
import useStyles from "./styles";
import logo from "./logo.svg";
import { useUserDispatch, loginUser } from "../../context/UserContext";
import { useApi } from "../../hooks/useApi";

function Login(props) {
  var classes = useStyles();
  var userDispatch = useUserDispatch();
  const loginRequest = useApi({
    method: "post",
    url: "user/login",
  });
  var [isLoading, setIsLoading] = useState(false);
  var [error, setError] = useState(null);

  var [usernameValue, setUsernameValue] = useState("ali");
  var [passwordValue, setPasswordValue] = useState("123456");

  const onPressEnter = function (event) {
    if (event.which === 13 && passwordValue && usernameValue) {
      loginUser(
        loginRequest,
        userDispatch,
        usernameValue,
        passwordValue,
        props.history,
        setIsLoading,
        setError,
      );
    }
  };

  return (
    <Grid container className={classes.container}>
      <div className={classes.logotypeContainer}>
        <img src={logo} alt="logo" className={classes.logotypeImage} />
        <Typography className={classes.logotypeText}>
          سیستم جامع حسابداری
        </Typography>
      </div>
      <div className={classes.formContainer}>
        <div className={classes.form}>
          <React.Fragment>
            <div className={classes.title}>
              <Divider />
              <Typography variant="h4" className={classes.greeting}>
                ورود به سیستم
              </Typography>
              <Divider />
            </div>

            <TextField
              label="نام کاربری"
              variant="outlined"
              id="username"
              InputProps={{
                classes: {
                  input: classes.textField,
                },
              }}
              value={usernameValue}
              onChange={(e) => setUsernameValue(e.target.value)}
              margin="normal"
              fullWidth
            />
            <TextField
              label="رمز عبور "
              variant="outlined"
              id="password"
              InputProps={{
                classes: {
                  input: classes.textField,
                },
              }}
              value={passwordValue}
              onChange={(e) => setPasswordValue(e.target.value)}
              margin="normal"
              type="password"
              fullWidth
              onKeyPress={onPressEnter}
            />
            <div className={classes.formButtons}>
              {isLoading ? (
                <CircularProgress size={26} className={classes.loginLoader} />
              ) : (
                <Button
                  disabled={
                    usernameValue.length === 0 || passwordValue.length === 0
                  }
                  onClick={() =>
                    loginUser(
                      loginRequest,
                      userDispatch,
                      usernameValue,
                      passwordValue,
                      props.history,
                      setIsLoading,
                      setError,
                    )
                  }
                  variant="contained"
                  color="primary"
                  size="large"
                >
                  ورود
                </Button>
              )}
              <Button
                color="primary"
                size="large"
                className={classes.forgetButton}
              >
                بازیابی رمز عبور
              </Button>
            </div>
          </React.Fragment>
        </div>
        <Typography color="primary" className={classes.copyright}>
          تمامی حقوق مادی و معنوی این اثر متعلق به شرکت المان می باشد
        </Typography>
      </div>
    </Grid>
  );
}

export default withRouter(Login);
