import React, { useEffect, useState } from "react";
import { Grid, TextField, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Constant from "../../helpers/constant";

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

export default function MainDetail({ detail, onDismiss }) {
  const classes = useStyles();
  const [copyState, setCopyState] = useState();

  const onCopy = (copyField) => {
    setCopyState(copyField);
  };

  useEffect(() => {}, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} className={classes.grid}>
        <TextField
          disabled
          label="بانک"
          value={detail.bank.name || " "}
          variant="outlined"
          fullWidth
          size="small"
        />
        <img
          src={`${Constant.API_ADDRESS}/${detail.bank.logo}`}
          alt={detail.bank.logo}
          className={classes.img}
        />
      </Grid>
      <Grid item xs={12} className={classes.grid}>
        <TextField
          disabled
          label="شماره کارت"
          value={detail.accountCardNumber || " "}
          variant="outlined"
          fullWidth
          size="small"
        />
        <CopyToClipboard
          onCopy={() => onCopy("accountCardNumber")}
          text={detail.accountCardNumber}
        >
          <i
            className="material-icons-round"
            style={{ marginRight: 20, cursor: "pointer" }}
          >
            {copyState === "accountCardNumber" ? "done" : "copy"}
          </i>
        </CopyToClipboard>
      </Grid>
      <Grid item xs={12} className={classes.grid}>
        <TextField
          disabled
          label="شماره حساب"
          value={detail.accountNumber || " "}
          variant="outlined"
          fullWidth
          size="small"
        />
        <CopyToClipboard
          onCopy={() => onCopy("accountNumber")}
          text={detail.accountNumber}
        >
          <i
            className="material-icons-round"
            style={{ marginRight: 20, cursor: "pointer" }}
          >
            {copyState === "accountNumber" ? "done" : "copy"}
          </i>
        </CopyToClipboard>
      </Grid>
      <Grid item xs={12} className={classes.grid}>
        <TextField
          disabled
          label="شماره شبا"
          value={detail.accountShaba || " "}
          variant="outlined"
          fullWidth
          size="small"
        />
        <CopyToClipboard
          onCopy={() => onCopy("accountShaba")}
          text={detail.accountShaba}
        >
          <i
            className="material-icons-round"
            style={{ marginRight: 20, cursor: "pointer" }}
          >
            {copyState === "accountShaba" ? "done" : "copy"}
          </i>
        </CopyToClipboard>
      </Grid>

      <Grid item xs={12}>
        <TextField
          disabled
          label="توضیحات"
          value={detail.description || " "}
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
