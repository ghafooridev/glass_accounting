import React from "react";
import ReactDOM from "react-dom";
import "./assets/css/font.css";
import { ThemeProvider } from "@material-ui/styles";
import { CssBaseline } from "@material-ui/core";
import { Provider } from "react-redux";
import Alert from "./components/Alert";
import Dialog from "./components/Modal";
import Themes from "./themes";
import App from "./components/App";
import * as serviceWorker from "./serviceWorker";
import { LayoutProvider } from "./context/LayoutContext";
import { UserProvider } from "./context/UserContext";
import store from "./redux/store";
import RTLProvider from "./themes/RTL";
import jMoment from "moment-jalaali";
import JalaliUtils from "@date-io/jalaali";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";

jMoment.loadPersian({ dialect: "persian-modern", usePersianDigits: true });

ReactDOM.render(
  <MuiPickersUtilsProvider utils={JalaliUtils} locale="fa">
    <Provider store={store}>
      <LayoutProvider>
        <UserProvider>
          <ThemeProvider theme={Themes.default}>
            <RTLProvider>
              <CssBaseline />
              <App />
              <Alert />
              <Dialog />
            </RTLProvider>
          </ThemeProvider>
        </UserProvider>
      </LayoutProvider>
    </Provider>
  </MuiPickersUtilsProvider>,
  document.getElementById("root"),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
