import React, { Fragment, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  MenuItem,
} from "@material-ui/core";
import { useForm, Controller } from "react-hook-form";
import { useApi } from "../../hooks/useApi";
import Constant from "../../helpers/constant";
import { getQueryString } from "../../helpers/utils";
import CircularProgress from "../../components/CircularProgress";
import DialogActions from "../../redux/actions/dialogAction";
import PersonSelector from "./personSelector";
import { DatePicker } from "@material-ui/pickers";
import moment from "moment";

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
  accordionSummary: {
    backgroundColor: theme.palette.primary.light,
  },
}));

export default function MainDetail({ defaultValues }) {
  const classes = useStyles();
  const history = useHistory();
  const id = getQueryString("id");
  const [detail, setDetail] = useState({});
  const [selectedPerson, setSelectedPerson] = useState();
  const { control, handleSubmit, errors, reset } = useForm();
  const [selectedDate, handleDateChange] = useState(moment());
  const [banks, setBanks] = useState([]);
  const [expanded, setExpanded] = React.useState("panel1");
  const [selectedBank, setSelectedBank] = useState(
    defaultValues?.bank.value || 1,
  );

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

  const getBankRequest = useApi({
    method: "get",
    url: `bank`,
  });

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const onChangeBank = (e) => {
    setSelectedBank(e.target.value);
  };

  const onSelectPerson = (person) => {
    const name = person.firstName + person.lastName;
    console.log(name);
    setSelectedPerson(name);
    DialogActions.hide();
  };

  const onDismissPerson = (person) => {
    DialogActions.hide();
  };

  const onShowDialog = () => {
    DialogActions.show({
      title: "انتخاب شخص",
      component: (
        <PersonSelector onSelect={onSelectPerson} onDismiss={onDismissPerson} />
      ),
      size: "lg",
      confirm: false,
      disableCloseButton: false,
    });
  };

  const onSubmit = async (data) => {
    if (id) {
      await editPaymentRequest.execute(data);
    } else {
      await addPaymentRequest.execute(data);
    }
  };

  const onReject = () => {
    history.push("/app/payment-list");
  };

  const getDetail = async () => {
    const detail = await detailPaymentRequest.execute();
    setDetail(detail.data);
  };

  const getBanks = async () => {
    const result = await getBankRequest.execute();
    setBanks(result.data);
  };

  useEffect(() => {
    if (id) {
      getDetail();
    }
    getBanks();
  }, []);

  useEffect(() => {
    reset(detail);
  }, [reset, detail]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {!detailPaymentRequest.pending ? (
        <Grid item lg={8} sm={12} className={classes.root}>
          <Paper className={classes.paper}>
            <Typography
              className={classes.title}
              variant="h6"
              id="tableTitle"
              component="div"
            >
              {id ? "ویرایش کاربر" : "افزودن کاربر"}
            </Typography>

            <Grid container spacing={3}>
              <Fragment>
                <Grid item lg={6} xs={12} style={{ display: "flex" }}>
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
                <Grid item lg={6} xs={12} className={classes.datePicker}>
                  <DatePicker
                    name="date"
                    label="تاریخ ثبت"
                    inputVariant="outlined"
                    okLabel="تأیید"
                    cancelLabel="لغو"
                    labelFunc={(date) =>
                      date ? date.format("jYYYY/jMM/jDD") : ""
                    }
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
                <Grid item xs={12}>
                  <Accordion
                    expanded={expanded === "panel1"}
                    onChange={handleChange("panel1")}
                  >
                    <AccordionSummary
                      className={classes.accordionSummary}
                      expandIcon={
                        <i className="material-icons-round">expand_more</i>
                      }
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography className={classes.heading}>نقدی</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid item lg={6} xs={12}>
                        <Controller
                          control={control}
                          render={({ onChange, value, name }) => {
                            return (
                              <TextField
                                variant="outlined"
                                label="مبلغ نقدی"
                                number
                                name={name}
                                onChange={onChange}
                                value={value}
                                error={!!errors.amount}
                                helperText={
                                  errors.amount ? errors.amount.message : ""
                                }
                                fullWidth
                                size="small"
                              />
                            );
                          }}
                          name="amount"
                        />
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                  <Accordion>
                    <AccordionSummary
                      className={classes.accordionSummary}
                      expandIcon={
                        <i className="material-icons-round">expand_more</i>
                      }
                      aria-controls="panel2a-content"
                      id="panel2a-header"
                    >
                      <Typography className={classes.heading}>کارت</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={3}>
                        <Grid item lg={6} xs={12}>
                          <Controller
                            control={control}
                            render={({ onChange, value, name }) => {
                              return (
                                <TextField
                                  variant="outlined"
                                  label="مبلغ قبض"
                                  number
                                  name={name}
                                  onChange={onChange}
                                  value={value}
                                  error={!!errors.cardAmount}
                                  helperText={
                                    errors.cardAmount
                                      ? errors.cardAmount.message
                                      : ""
                                  }
                                  fullWidth
                                  size="small"
                                />
                              );
                            }}
                            name="cardAmount"
                          />
                        </Grid>
                        <Grid item lg={6} xs={12}>
                          <TextField
                            select
                            label="صندوق"
                            onChange={onChangeBank}
                            value={selectedBank}
                            variant="outlined"
                            fullWidth
                            size="small"
                            name="bank"
                            SelectProps={{
                              classes: {
                                select: classes.rootSelect,
                              },
                            }}
                          >
                            {banks.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                <img
                                  src={`${Constant.API_ADDRESS}/${option.logo}`}
                                  alt={option.label}
                                  style={{
                                    width: 25,
                                    height: 25,
                                    borderRadius: "50%",
                                    marginLeft: 10,
                                  }}
                                />
                                {option.label}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                        <Grid item lg={6} xs={12}>
                          <Controller
                            control={control}
                            render={({ onChange, value, name }) => {
                              return (
                                <TextField
                                  variant="outlined"
                                  label="شماره رهگیری"
                                  number
                                  name={name}
                                  onChange={onChange}
                                  value={value}
                                  error={!!errors.code}
                                  helperText={
                                    errors.code ? errors.code.message : ""
                                  }
                                  fullWidth
                                  size="small"
                                />
                              );
                            }}
                            name="code"
                          />
                        </Grid>
                        <Grid item lg={6} xs={12}>
                          <TextField
                            select
                            label="بانک"
                            onChange={onChangeBank}
                            value={selectedBank}
                            variant="outlined"
                            fullWidth
                            size="small"
                            name="bank"
                            SelectProps={{
                              classes: {
                                select: classes.rootSelect,
                              },
                            }}
                          >
                            {banks.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                <img
                                  src={`${Constant.API_ADDRESS}/${option.logo}`}
                                  alt={option.label}
                                  style={{
                                    width: 25,
                                    height: 25,
                                    borderRadius: "50%",
                                    marginLeft: 10,
                                  }}
                                />
                                {option.label}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                  <Accordion>
                    <AccordionSummary
                      className={classes.accordionSummary}
                      expandIcon={
                        <i className="material-icons-round">expand_more</i>
                      }
                      aria-controls="panel3a-content"
                      id="panel3a-header"
                    >
                      <Typography className={classes.heading}>چک</Typography>
                    </AccordionSummary>
                  </Accordion>
                </Grid>

                <Grid
                  item
                  xs={12}
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Button variant="contained" color="primary" type="submit">
                    تایید
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={onReject}
                  >
                    بازگشت
                  </Button>
                </Grid>
              </Fragment>
            </Grid>
          </Paper>
        </Grid>
      ) : (
        <CircularProgress />
      )}
    </form>
  );
}
