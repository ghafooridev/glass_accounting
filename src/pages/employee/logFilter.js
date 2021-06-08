import React, { useState } from "react";
import { Grid, Button, Divider } from "@material-ui/core";
import { DatePicker } from "@material-ui/pickers";
import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  datePicker: {
    "& input": {
      padding: "10px 14px",
    },
  },
}));
const Filter = ({ onFilter }) => {
  const classes = useStyles();
  const [selectedFromDate, handleFromDateChange] = useState(moment());
  const [selectedToDate, handleToDateChange] = useState(moment());

  const onChnageDate = (e, type) => {
    if (type === "from") {
      handleFromDateChange(e);
    } else {
      handleToDateChange(e);
    }
  };

  const onSubmit = () => {
    if (typeof onFilter === "function") {
      onFilter(
        `{from:${selectedFromDate._d.toISOString()},to:${selectedToDate._d.toISOString()}}`,
      );
    }
  };

  return (
    <Grid container spacing={3} alignItems="center" style={{ padding: 10 }}>
      <Grid item lg={3} xs={12} className={classes.datePicker}>
        <DatePicker
          autoOk
          name="date"
          label="از تاریخ"
          inputVariant="outlined"
          okLabel="تأیید"
          cancelLabel="لغو"
          labelFunc={(date) => (date ? date.format("jYYYY/jMM/jDD") : "")}
          value={selectedFromDate}
          onChange={(e) => onChnageDate(e, "from")}
          style={{ width: "100%" }}
        />
      </Grid>
      <Grid item lg={3} xs={12} className={classes.datePicker}>
        <DatePicker
          autoOk
          name="date"
          label="تا تاریخ"
          inputVariant="outlined"
          okLabel="تأیید"
          cancelLabel="لغو"
          labelFunc={(date) => (date ? date.format("jYYYY/jMM/jDD") : "")}
          value={selectedToDate}
          onChange={(e) => onChnageDate(e, "to")}
          style={{ width: "100%" }}
        />
      </Grid>
      <Grid item lg={3} xs={12}>
        <Button variant="contained" color="primary" onClick={onSubmit}>
          تایید
        </Button>
      </Grid>
      <Divider style={{ width: "100%" }} />
    </Grid>
  );
};
export default Filter;
