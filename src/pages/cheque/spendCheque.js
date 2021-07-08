import React, { Fragment, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Paper, TextField, Button } from "@material-ui/core";
import { useApi } from "../../hooks/useApi";
import { DatePicker } from "@material-ui/pickers";
import moment from "moment";
import Autocomplete from "@material-ui/lab/Autocomplete";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "0 auto",
  },
  paper: {
    width: "100%",
    padding: 20,
  },
  title: {
    paddingBottom: 20,
  },
  datePicker: {
    "& input": {
      padding: "10px 14px",
    },
  },
  rootSelect: {
    display: "flex",
    alignItems: "center",
    paddingBottom: 7,
    paddingTop: 7,
  },
}));

export default function SpendCheque({ chequeId, onDismiss, onSubmit }) {
  const classes = useStyles();
  const [selectedPerson, setSelectedPerson] = useState();
  const [selectedDate, handleDateChange] = useState(moment());
  const [persons, setPersons] = useState([]);
  const [description, setDescription] = useState();

  const getPersonsRequest = useApi({
    method: "get",
    url: "customer",
  });

  const getPersons = async () => {
    const personList = await getPersonsRequest.execute();
    setPersons(personList.data);
  };

  const onDone = () => {
    onSubmit({
      chequeId,
      personId: selectedPerson.id,
      personType: selectedPerson.type,
      date: selectedDate._d,
      description,
    });
  };

  const onChangePerson = (e, value) => {
    setSelectedPerson(value);
  };

  const onChangeDescription = (e) => {
    setDescription(e.target.value);
  };

  useEffect(() => {
    getPersons();
  }, []);

  return (
    <Grid container spacing={3}>
      <Fragment>
        <Grid item xs={12} style={{ display: "flex" }}>
          <Autocomplete
            id="combo-box-demo"
            onChange={onChangePerson}
            options={persons}
            getOptionLabel={(option) =>
              `${option.firstName} ${option.lastName}`
            }
            fullWidth
            size="small"
            renderInput={(params) => (
              <TextField {...params} label="انتخاب شخص" variant="outlined" />
            )}
          />
        </Grid>
        <Grid item xs={12} className={classes.datePicker}>
          <DatePicker
            autoOk
            name="date"
            label="تاریخ ثبت"
            inputVariant="outlined"
            okLabel="تأیید"
            cancelLabel="لغو"
            labelFunc={(date) => (date ? date.format("jYYYY/jMM/jDD") : "")}
            value={selectedDate}
            onChange={handleDateChange}
            style={{ width: "100%" }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            label="بابت"
            name={"description"}
            onChange={onChangeDescription}
            value={description}
            fullWidth
            size="small"
          />
        </Grid>

        <Grid
          item
          xs={12}
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <Button variant="contained" color="primary" onClick={onDone}>
            تایید
          </Button>
          <Button variant="contained" color="secondary" onClick={onDismiss}>
            بازگشت
          </Button>
        </Grid>
      </Fragment>
    </Grid>
  );
}
