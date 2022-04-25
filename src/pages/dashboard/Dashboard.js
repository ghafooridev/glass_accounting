import React from "react";
import { useHistory } from "react-router-dom";
import { Grid } from "@material-ui/core";

import Constant from "../../helpers/constant";
import useStyles from "./styles";
import { Typography } from "../../components/Wrappers";

import Paper from "../../components/Paper";
import { hasPermission } from "../../helpers/utils";

export default function Dashboard() {
  var classes = useStyles();
  const history = useHistory();

  const onClickPaper = (type) => {
    history.push(`/app/${type}`);
  };

  return (
    <div style={{ display: "flex", alignItems: "flex-start" }}>
      <Grid container spacing={4} style={{ marginLeft: 20 }}>
        {hasPermission(Constant.ALL_PERMISSIONS.INVOICE_EDIT) && (
          <Grid item md={6} xs={12} style={{ height: 300 }}>
            <Paper
              style={{ backgroundColor: "#b8e4c4" }}
              icon="bolt"
              onClick={() => {
                onClickPaper("fast_invoice?type=SELL");
              }}
            >
              <div className={classes.paperTitle}>
                <Typography variant="h3" style={{ color: "#137333" }}>
                  فاکتور فروش سریع
                </Typography>
              </div>
            </Paper>
          </Grid>
        )}
        {hasPermission(Constant.ALL_PERMISSIONS.INVOICE_EDIT) && (
          <Grid item md={6} xs={12} style={{ height: 300 }}>
            <Paper
              style={{ backgroundColor: "#f9d5d1" }}
              icon="bolt"
              onClick={() => {
                onClickPaper("fast_invoice?type=BUY");
              }}
            >
              <div className={classes.paperTitle}>
                <Typography variant="h3" style={{ color: "#c5221f" }}>
                  فاکتور خرید سریع
                </Typography>
              </div>
            </Paper>
          </Grid>
        )}
      </Grid>
      <Grid container spacing={4} style={{ marginBottom: 20 }}>
        {/* {hasPermission(Constant.ALL_PERMISSIONS.INVOICE_EDIT) && (
          <Grid item lg={6} md={6} sm={6} xs={12} style={{ height: 300 }}>
            <Paper
              icon="shopping_basket"
              onClick={() => {
                onClickPaper("invoice-detail?type=BUY");
              }}
            >
              <div className={classes.paperTitle}>
                <Typography variant="h3">ثبت خرید</Typography>
              </div>
            </Paper>
          </Grid>
        )}
        {hasPermission(Constant.ALL_PERMISSIONS.INVOICE_EDIT) && (
          <Grid item lg={6} md={6} sm={6} xs={12} style={{ height: 300 }}>
            <Paper
              icon="sell"
              onClick={() => {
                onClickPaper("invoice-detail?type=SELL");
              }}
            >
              <div className={classes.paperTitle}>
                <Typography variant="h3">ثبت فروش</Typography>
              </div>
            </Paper>
          </Grid>
        )} */}
        {hasPermission(Constant.ALL_PERMISSIONS.INVOICE_EDIT) && (
          <Grid item lg={6} md={6} sm={6} xs={12} style={{ height: 300 }}>
            <Paper
              icon="move_to_inbox"
              onClick={() => {
                onClickPaper("payment-detail?type=INCOME");
              }}
            >
              <div className={classes.paperTitle}>
                <Typography variant="h3">ثبت دریافت</Typography>
              </div>
            </Paper>
          </Grid>
        )}
        {hasPermission(Constant.ALL_PERMISSIONS.PAYMENT_EDIT) && (
          <Grid item lg={6} md={6} sm={6} xs={12} style={{ height: 300 }}>
            <Paper
              icon="unarchive"
              onClick={() => {
                onClickPaper("payment-detail?type=OUTCOME");
              }}
            >
              <div className={classes.paperTitle}>
                <Typography variant="h3">ثبت پرداخت</Typography>
              </div>
            </Paper>
          </Grid>
        )}
      </Grid>
    </div>
  );
}
