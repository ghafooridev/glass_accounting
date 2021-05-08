import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import classnames from "classnames";

import useStyles from "./styles";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";

import Dashboard from "../../pages/dashboard/Dashboard";
import UserList from "../../pages/users";
import UserDetail from "../../pages/users/detail";
import CustomerList from "../../pages/customers";
import CustomerDetail from "../../pages/customers/detail";
import CustomerTransaction from "../../pages/customers/transaction";
import EmployeeList from "../../pages/employee";
import EmployeeDetail from "../../pages/employee/detail";
import SellList from "../../pages/sell";
import SellDetail from "../../pages/sell/detail";
import BuyList from "../../pages/buy";
import BuyDetail from "../../pages/buy/detail";
import ProductList from "../../pages/product";
import ProductDetail from "../../pages/product/detail";
import Setting from "../../pages/setting";

import { useLayoutState } from "../../context/LayoutContext";

function Layout(props) {
  var classes = useStyles();

  var layoutState = useLayoutState();

  return (
    <div className={classes.root}>
      <>
        <Router>
          <Header history={props.history} />
          <Sidebar />
          <div
            className={classnames(classes.content, {
              [classes.contentShift]: layoutState.isSidebarOpened,
            })}
          >
            <div className={classes.fakeToolbar} />

            <Switch>
              <Route path="/app/dashboard" component={Dashboard} />

              <Route path="/app/user-list" component={UserList} />
              <Route path="/app/user-detail" component={UserDetail} />

              <Route path="/app/customer-list" component={CustomerList} />
              <Route path="/app/customer-detail" component={CustomerDetail} />
              <Route
                path="/app/customer-transaction"
                component={CustomerTransaction}
              />

              <Route path="/app/employee-list" component={EmployeeList} />
              <Route path="/app/employee-detail" component={EmployeeDetail} />

              <Route path="/app/sell-list" component={SellList} />
              <Route path="/app/sell-detail" component={SellDetail} />

              <Route path="/app/buy-list" component={BuyList} />
              <Route path="/app/buy-detail" component={BuyDetail} />

              <Route path="/app/product-list" component={ProductList} />
              <Route path="/app/product-detail" component={ProductDetail} />

              <Route path="/app/setting" component={Setting} />
            </Switch>
          </div>
        </Router>
      </>
    </div>
  );
}

export default Layout;
