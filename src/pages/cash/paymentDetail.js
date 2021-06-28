import React from "react";
import { Grid, TextField, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Constant from "../../helpers/constant";
import { persianNumber } from "../../helpers/utils";
const useStyles = makeStyles((theme) => ({
  img: {
    width: 35,
    height: 35,
    borderRadius: 50,
    marginLeft: 20,
  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: 50,
    cursor: "pointer",
  },
  grid: {
    display: "flex",
    alignItems: "center",
  },
}));

export default function MainDetail({ data, type, onDismiss }) {
  const classes = useStyles();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          disabled
          label={`${data.paymentType === "INOME" ? "دریافت از" : "پرداخت به"}`}
          value={data.name || " "}
          variant="outlined"
          fullWidth
          size="small"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          disabled
          label="تاریخ"
          value={
            persianNumber(new Date(data.date).toLocaleDateString("fa-IR")) ||
            " "
          }
          variant="outlined"
          fullWidth
          size="small"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          disabled
          label="مبلغ"
          value={persianNumber(data.price) || " "}
          variant="outlined"
          fullWidth
          size="small"
        />
      </Grid>
      {(type === "BANK" || type === "CHEQUE") && (
        <Grid item xs={12} style={{ display: "flex" }}>
          <TextField
            disabled
            label="بانک"
            value={data.detail.bank.name || " "}
            variant="outlined"
            fullWidth
            size="small"
          />
          <img
            src={`${Constant.API_ADDRESS}/${data.detail.bank.logo}`}
            alt={data.detail.bank.logo}
            className={classes.img}
          />
        </Grid>
      )}
      {type === "BANK" && (
        <Grid item xs={12}>
          <TextField
            disabled
            label="نوع تراکنش"
            value={data.detail.transactionType || " "}
            variant="outlined"
            fullWidth
            size="small"
          />
        </Grid>
      )}
      {type === "BANK" && (
        <Grid item xs={12}>
          <TextField
            disabled
            label="شماره پیگیری"
            value={persianNumber(data.detail.trackingCode) || " "}
            variant="outlined"
            fullWidth
            size="small"
          />
        </Grid>
      )}
      {type === "CHEQUE" && (
        <Grid item xs={12}>
          <TextField
            disabled
            label="شماره چک"
            value={persianNumber(data.detail.chequeNumber) || " "}
            variant="outlined"
            fullWidth
            size="small"
          />
        </Grid>
      )}
      {type === "CHEQUE" && (
        <Grid item xs={12}>
          <TextField
            disabled
            label="تاریخ سررسید"
            value={
              persianNumber(
                new Date(data.detail.chequeDueDate).toLocaleDateString("fa-IR"),
              ) || " "
            }
            variant="outlined"
            fullWidth
            size="small"
          />
        </Grid>
      )}

      {type === "CHEQUE" && (
        <Grid item xs={12}>
          <TextField
            disabled
            label="در وجه"
            value={data.detail.chequePayTo || " "}
            variant="outlined"
            fullWidth
            size="small"
          />
        </Grid>
      )}

      <Grid item xs={12}>
        <TextField
          disabled
          label="توضیحات"
          value={data.description || " "}
          variant="outlined"
          fullWidth
          size="small"
        />
      </Grid>

      <Grid
        item
        xs={12}
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <Button variant="contained" color="secondary" onClick={onDismiss}>
          بازگشت
        </Button>
      </Grid>
    </Grid>
  );
}
