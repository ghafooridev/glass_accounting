import React, { Fragment, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Paper, TextField, Button } from "@material-ui/core";
import Constant from "../../helpers/constant";
import { useForm, Controller } from "react-hook-form";
import { useApi } from "../../hooks/useApi";
import { getQueryString } from "../../helpers/utils";
import PersonSelector from "../payment/personSelector";
import { DatePicker } from "@material-ui/pickers";
import moment from "moment";
import dialogAction from "../../redux/actions/dialogAction";

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

export default function MainDetail({ defaultValues }) {
  const paymentRef = useRef(null);
  const classes = useStyles();
  const history = useHistory();
  const id = getQueryString("id");
  const [detail, setDetail] = useState({});
  const [selectedPerson, setSelectedPerson] = useState();
  const { control, handleSubmit, errors, reset } = useForm();
  const [selectedDate, handleDateChange] = useState(moment());

  const addPaymentRequest = useApi({
    method: "post",
    url: `payment`,
  });
  const editPaymentRequest = useApi({
    method: "put",
    url: `payment/${id}`,
  });
  const detailPaymentRequest = useApi({
    method: "get",
    url: `payment/${id}`,
  });

  const onSelectPerson = (person) => {
    const name = person.firstName + person.lastName;
    setSelectedPerson(name);
    dialogAction.hide();
  };

  const onDismissPerson = () => {
    dialogAction.hide();
  };

  const onShowDialog = () => {
    dialogAction.show({
      title: "انتخاب شخص",
      component: (
        <PersonSelector
          onSelect={onSelectPerson}
          onDismiss={onDismissPerson}
          filter={Constant.PERSON_TYPE.CUSTOMER}
        />
      ),
      size: "lg",
      confirm: false,
      disableCloseButton: false,
    });
  };

  const onSubmit = async (data) => {
    console.log(paymentRef.current);
    if (id) {
      await editPaymentRequest.execute(data);
    } else {
      await addPaymentRequest.execute(data);
    }
  };

  const onReject = () => {
    history.push("/app/payment-list?type=ALL");
  };

  const getDetail = async () => {
    const detail = await detailPaymentRequest.execute();
    setDetail(detail.data);
  };

  useEffect(() => {
    if (id) {
      getDetail();
    }
  }, []);

  useEffect(() => {
    reset(detail);
  }, [reset, detail]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Fragment>
          <Grid item xs={12} style={{ display: "flex" }}>
            <Button
              style={{ marginLeft: 10, width: "30%" }}
              variant="contained"
              color="primary"
              onClick={onShowDialog}
            >
              انتخاب شخص
            </Button>

            <TextField
              variant="outlined"
              name={"personName"}
              value={selectedPerson}
              disabled
              style={{ width: "70%" }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} className={classes.datePicker}>
            <DatePicker
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
            <Controller
              control={control}
              render={({ onChange, value, name }) => {
                return (
                  <TextField
                    variant="outlined"
                    label="بابت"
                    name={name}
                    onChange={onChange}
                    value={value}
                    error={!!errors.description}
                    helperText={
                      errors.description ? errors.description.message : ""
                    }
                    fullWidth
                    size="small"
                  />
                );
              }}
              name="description"
            />
          </Grid>

          <Grid
            item
            xs={12}
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <Button variant="contained" color="primary" type="submit">
              تایید
            </Button>
            <Button variant="contained" color="secondary" onClick={onReject}>
              بازگشت
            </Button>
          </Grid>
        </Fragment>
      </Grid>
    </form>
  );
}
