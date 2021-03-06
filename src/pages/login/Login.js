import React, { useEffect, useState } from "react";
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
import back from "./111.jpg";
import { useUserDispatch, loginUser } from "../../context/UserContext";
import { useApi } from "../../hooks/useApi";
import unitAcion from "../../redux/actions/unitAction";

function Login(props) {
  const classes = useStyles();
  const userDispatch = useUserDispatch();
  const loginRequest = useApi({
    method: "post",
    url: "auth/login",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [usernameValue, setUsernameValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

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

  useEffect(() => {
    unitAcion.setProdcutUnit();
  }, []);

  return (
    <Grid container className={classes.container}>
      <div className={classes.logotypeContainer}>
        <img src={back} alt="logo" className={classes.backgroundImage} />
        <img src={logo} alt="logo" className={classes.logotypeImage} />
        <Typography className={classes.logotypeText}>
          سیستم یکپارچه مدیریت
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
                  fullWidth
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
                  ورود به سیستم
                </Button>
              )}
              {/* <Button
                color="primary"
                size="large"
                className={classes.forgetButton}
              >
                بازیابی رمز عبور
              </Button> */}
            </div>
          </React.Fragment>
        </div>
        <Typography
          color="primary"
          className={classes.copyright}
          variant="caption"
        >
          تمامی حقوق مادی و معنوی این اثر متعلق به شرکت المان می باشد
        </Typography>
      </div>
    </Grid>
  );
}

export default withRouter(Login);
