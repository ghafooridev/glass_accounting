import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import classnames from "classnames";

import useStyles from "./styles";
import Header from "../Header/Header";
import Sidebar from "../Sidebar";

import Dashboard from "../../pages/dashboard";
import UserList from "../../pages/users";
import UserDetail from "../../pages/users/detail";

import Charts from "../../pages/charts";

// context
import { useLayoutState } from "../../context/LayoutContext";

function Layout(props) {
  var classes = useStyles();

  // global
  var layoutState = useLayoutState();

  return (
    <div className={classes.root}>
      <>
        <Header history={props.history} />
        <Sidebar />
        <div
          className={classnames(classes.content, {
            [classes.contentShift]: layoutState.isSidebarOpened,
          })}
        >
          <div className={classes.fakeToolbar} />

          <Router>
            <Switch>
              <Route path="/app/dashboard" component={Dashboard} />
              <Route path="/app/buy-list" component={Dashboard} />
              <Route path="/app/user-list" component={UserList} />
              <Route path="/app/user-detail" component={UserDetail} />
              <Route path="/app/sell-list" component={Dashboard} />
              <Route path="/app/cash-list" component={Dashboard} />
              <Route path="/app/personel-list" component={Dashboard} />
              <Route path="/app/customer-list" component={Dashboard} />
              <Route path="/app/product-list" component={Dashboard} />

              <Route path="/app/typography" component={Dashboard} />
              <Route path="/app/tables" component={Dashboard} />
              <Route path="/app/notifications" component={Dashboard} />

              <Route path="/app/ui/maps" component={Dashboard} />
              <Route path="/app/ui/icons" component={Dashboard} />
              <Route path="/app/ui/charts" component={Charts} />
            </Switch>
          </Router>
        </div>
      </>
    </div>
  );
}

export default Layout;
