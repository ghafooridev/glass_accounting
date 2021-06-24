import React, { useState, useEffect } from "react";
import { Grid, TextField, MenuItem, Button, Divider } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { DatePicker } from "@material-ui/pickers";
import moment from "moment";
import { useApi } from "../../hooks/useApi";
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
  const [selectedPerson, setSelectedPerson] = useState();
  const [selectedFromDate, handleFromDateChange] = useState(moment());
  const [selectedToDate, handleToDateChange] = useState(moment());
  const [customers, setCustomers] = useState([]);

  const getCustomersRequest = useApi({
    method: "get",
    url: "customer",
  });

  const onChangePerson = (e, value) => {
    setSelectedPerson(value);
  };

  const onChnageDate = (e, type) => {
    console.log(e, type);
    if (type === "from") {
      handleFromDateChange(e);
    } else {
      handleToDateChange(e);
    }
  };

  const getCustomers = async () => {
    const customerList = await getCustomersRequest.execute();
    setCustomers(customerList.data);
  };

  const onSubmit = () => {
    if (typeof onFilter === "function") {
      onFilter(
        `{customerId:${
          selectedPerson ? selectedPerson.id : null
        },from:${selectedFromDate._d.toISOString()},to:${selectedToDate._d.toISOString()}}`,
      );
    }
  };

  useEffect(() => {
    getCustomers();
  }, []);

  return (
    <Grid container spacing={3} alignItems="center" style={{ padding: 10 }}>
      <Grid item lg={3} xs={12} style={{ display: "flex" }}>
        <Autocomplete
          id="combo-box-demo"
          onChange={onChangePerson}
          options={customers}
          getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
          fullWidth
          size="small"
          renderInput={(params) => (
            <TextField {...params} label="انتخاب شخص" variant="outlined" />
          )}
        />
      </Grid>
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
