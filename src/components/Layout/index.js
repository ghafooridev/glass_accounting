import React, { useEffect } from "react";
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
import InvoiceList from "../../pages/invoice";
import InvoiceDetail from "../../pages/invoice/detail";
import FastInvoice from "../../pages/invoice/fastInvoice";
import ChequeList from "../../pages/cheque";
import ChequeDetail from "../../pages/cheque/detail";
import PaymentList from "../../pages/payment";
import PaymentDetail from "../../pages/payment/detail";
import ProductList from "../../pages/product";
import ProductDetail from "../../pages/product/detail";
import DepotList from "../../pages/depot";
import DepotDetail from "../../pages/depot/detail";
import CashList from "../../pages/cash";
import CashDetail from "../../pages/cash/detail";
import DriverList from "../../pages/driver";
import DriverDetail from "../../pages/driver/detail";
import Setting from "../../pages/setting";
import Category from "../../pages/category";
import Traffic from "../../pages/traffic";
import TrafficDetail from "../../pages/traffic/register";
import { useLayoutState } from "../../context/LayoutContext";
import EmployeeLog from "../../pages/employee/log";
import AccountsNumber from "../../pages/accountNumber/list";
import CashPaymentReport from "../../pages/cash/paymentReport";
import LoanList from "../../pages/loan";
import LoanDetail from "../../pages/loan/detail";
import ProductTransfer from "../../pages/product/transfer";

function Layout(props) {
  var classes = useStyles();

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
          <Switch>
            <Route path="/app/dashboard" component={Dashboard} />

            <Route path="/app/user-list" component={UserList} />
            <Route path="/app/user-detail" component={UserDetail} />

            <Route path="/app/customer-list" component={CustomerList} />
            <Route path="/app/customer-detail" component={CustomerDetail} />
            <Route
              path="/app/person-transaction"
              component={CustomerTransaction}
            />

            <Route path="/app/employee-list" component={EmployeeList} />
            <Route path="/app/employee-detail" component={EmployeeDetail} />
            <Route path="/app/employee-log" component={EmployeeLog} />

            <Route path="/app/driver-list" component={DriverList} />
            <Route path="/app/driver-detail" component={DriverDetail} />

            <Route path="/app/cash-list" component={CashList} />
            <Route path="/app/cash-detail" component={CashDetail} />
            <Route path="/app/cash-transaction" component={CashPaymentReport} />

            <Route path="/app/cheque-list" component={ChequeList} />
            <Route path="/app/cheque-detail" component={ChequeDetail} />

            <Route path="/app/cheque-list" component={ChequeList} />
            <Route path="/app/cheque-detail" component={ChequeDetail} />

            <Route path="/app/loan-list" component={LoanList} />
            <Route path="/app/loan-detail" component={LoanDetail} />

            <Route path="/app/invoice-list" component={InvoiceList} />
            <Route path="/app/invoice-detail" component={InvoiceDetail} />
            <Route path="/app/fast_invoice" component={FastInvoice} />

            <Route path="/app/payment-list" component={PaymentList} />
            <Route path="/app/payment-detail" component={PaymentDetail} />

            <Route path="/app/product-list" component={ProductList} />
            <Route path="/app/product-detail" component={ProductDetail} />
            <Route path="/app/product-transfer" component={ProductTransfer} />

            <Route path="/app/depot-list" component={DepotList} />
            <Route path="/app/depot-detail" component={DepotDetail} />

            <Route path="/app/setting" component={Setting} />
            <Route path="/app/category" component={Category} />

            <Route path="/app/traffic" component={Traffic} />
            <Route path="/app/traffic-detail" component={TrafficDetail} />
            <Route path="/app/accountNumber" component={AccountsNumber} />
          </Switch>
        </div>
      </>
    </div>
  );
}

export default Layout;
