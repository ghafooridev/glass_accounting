import React, { Fragment, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  ButtonGroup,
  AccordionSummary,
  AccordionDetails,
  Accordion,
  Table,
  TableBody,
  TableContainer,
  TableCell,
  TableRow,
  IconButton,
} from "@material-ui/core";
import TableHeader from "../../components/Table/TableHead";
import { DeleteIcon, EditIcon } from "../../components/icons";
import Constant from "../../helpers/constant";
import { useForm, Controller } from "react-hook-form";
import { useApi } from "../../hooks/useApi";
import { getQueryString } from "../../helpers/utils";
import CircularProgress from "../../components/CircularProgress";
import PersonSelector from "./personSelector";
import { DatePicker } from "@material-ui/pickers";
import moment from "moment";
import dialogAction from "../../redux/actions/dialogAction";
import Payment from "./paymnet";

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

const naghdPayHeadCells = [
  { id: "cash", label: "صندوق" },
  {
    id: "amount",
    label: "مبلغ ",
  },
  { id: "action" },
];
const cardPayHeadCells = [
  { id: "cash", label: "صندوق" },
  {
    id: "amount",
    label: "مبلغ ",
  },
  {
    id: "amount",
    label: "مبلغ ",
  },
  {
    id: "bank",
    label: "بانک ",
  },
  {
    id: "code",
    label: "شماره رهگیری ",
  },
  { id: "action" },
];
const checkPayHeadCells = [
  { id: "cash", label: "صندوق" },
  {
    id: "amount",
    label: "مبلغ ",
  },
  { id: "dueDate", label: "تاریخ سررسید" },
  {
    id: "bank",
    label: "بانک ",
  },
  { id: "action" },
];

export default function MainDetail({ defaultValues }) {
  const classes = useStyles();
  const history = useHistory();
  const id = getQueryString("id");
  const paymentType = getQueryString("type");
  const [detail, setDetail] = useState({});
  const [selectedPerson, setSelectedPerson] = useState();
  const { control, handleSubmit, errors, reset } = useForm();
  const [selectedDate, handleDateChange] = useState(moment());
  const [payments, setPayments] = useState({
    cashes: [],
    banks: [],
    cheques: [],
  });

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

  const onDismissPerson = (person) => {
    dialogAction.hide();
  };

  const onShowDialog = () => {
    dialogAction.show({
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

  const onSubmitPayment = (value, type) => {
    console.log(value, type);
    const types = {
      NAGHD: () => {
        console.log("x");
        setPayments(payments, { cashes: [...payments.cashes, value] });
      },
      CARD: () => {
        setPayments(payments, { banks: [...payments.banks, value] });
      },
      CHECK: () => {
        setPayments(payments, { cheques: [...payments.cheques, value] });
      },
    };
    if (types[type]) {
      return types[type]();
    }
  };
  console.log(payments);

  const onDismissPayment = () => {
    dialogAction.hide();
  };

  const onClickPayment = (type, data) => {
    dialogAction.show({
      title: `${paymentType === "INCOME" ? "دریافت" : "پرداخت"} ${
        type === "NAGHD" ? "نقدی" : type === "CARD" ? "کارتی" : "چکی"
      }`,
      component: (
        <Payment
          onSubmit={onSubmitPayment}
          onDismiss={onDismissPayment}
          defaultValues={data}
          paymentType={paymentType}
          type={type}
        />
      ),
      size: "xs",
      confirm: false,
      disableCloseButton: true,
    });
  };

  const getButtonTitle = (type) => {
    console.log(type, paymentType);
    const types = {
      NAGHD: () => {
        return (
          <Typography variant="button">
            {paymentType === "INCOME" ? "دریافت نقدی" : "پرداخت نقدی"}(
            {payments.cashes.length})
          </Typography>
        );
      },
      CARD: () => {
        return (
          <Typography variant="button">
            {paymentType === "INCOME" ? "دریافت کارتی" : "پرداخت کارتی"}(
            {payments.banks.length})
          </Typography>
        );
      },
      CHECK: () => {
        return (
          <Typography variant="button">
            {paymentType === "INCOME" ? "دریافت چکی" : "پرداخت چکی"}(
            {payments.cheques.length})
          </Typography>
        );
      },
    };
    if (types[type]) {
      return types[type]();
    }
  };

  const getDetailTitle = () => {
    if (id) {
      if (paymentType === "INCOME") {
        return "ویرایش دریافتی";
      }
      return "ویرایش پرداختی";
    } else {
      if (paymentType === "INCOME") {
        return "افزودن دریافتی";
      }
      return "افزودن پرداختی";
    }
  };

  const handleEditPayment = (value, type) => {
    console.log(value, type);
  };

  const handleDeletePayment = (value) => {
    console.log(value);
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
      {!detailPaymentRequest.pending ? (
        <Grid item lg={8} sm={12} className={classes.root}>
          <Paper className={classes.paper}>
            <Typography
              className={classes.title}
              variant="h6"
              id="tableTitle"
              component="div"
            >
              {getDetailTitle()}
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
                <Grid
                  item
                  xs={12}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <ButtonGroup color="primary">
                    <Button
                      startIcon={
                        <i className="material-icons-round">local_atm</i>
                      }
                      onClick={() => onClickPayment("NAGHD")}
                    >
                      {getButtonTitle("NAGHD")}
                    </Button>
                    <Button
                      startIcon={
                        <i className="material-icons-round">payment</i>
                      }
                      onClick={() => onClickPayment("CARD")}
                    >
                      {getButtonTitle("CARD")}
                    </Button>
                    <Button
                      startIcon={
                        <i className="material-icons-round">payments</i>
                      }
                      onClick={() => onClickPayment("CHECK")}
                    >
                      {getButtonTitle("CHECK")}
                    </Button>
                  </ButtonGroup>
                </Grid>

                <Grid item xs={12}>
                  <Accordion
                    defaultExpanded={payments.cashes.lenght}
                    disabled={!payments.cashes.lenght}
                  >
                    <AccordionSummary
                      className={classes.accordionSummary}
                      expandIcon={
                        <i className="material-icons-round">expand_more</i>
                      }
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography className={classes.heading}>
                        نقدی ها
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {!!payments.cashes.length && (
                        <Grid item xs={12}>
                          <Paper>
                            <TableContainer style={{ padding: "0 10px" }}>
                              <Table
                                className={classes.table}
                                size={"medium"}
                                style={{ paddingRight: 10 }}
                              >
                                <TableHeader headCells={naghdPayHeadCells} />

                                <TableBody>
                                  {payments.cashes.map((row) => {
                                    return (
                                      <TableRow
                                        hover
                                        tabIndex={-1}
                                        key={row.id}
                                        style={{ paddingRight: 10 }}
                                      >
                                        <TableCell padding="none">
                                          <div
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                            }}
                                          >
                                            {row.cash}
                                          </div>
                                        </TableCell>
                                        <TableCell padding="none">
                                          {row.amount}
                                        </TableCell>

                                        <TableCell
                                          padding="none"
                                          style={{ textAlign: "left" }}
                                        >
                                          <IconButton
                                            onClick={() =>
                                              handleEditPayment(row, "NAGHD")
                                            }
                                          >
                                            <EditIcon />
                                          </IconButton>

                                          <IconButton
                                            onClick={() =>
                                              handleDeletePayment(row.id)
                                            }
                                          >
                                            <DeleteIcon />
                                          </IconButton>
                                        </TableCell>
                                      </TableRow>
                                    );
                                  })}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </Paper>
                        </Grid>
                      )}
                    </AccordionDetails>
                  </Accordion>
                  <Accordion
                    defaultExpanded={payments.banks.lenght}
                    disabled={!payments.banks.lenght}
                  >
                    <AccordionSummary
                      className={classes.accordionSummary}
                      expandIcon={
                        <i className="material-icons-round">expand_more</i>
                      }
                      aria-controls="panel2a-content"
                      id="panel2a-header"
                    >
                      <Typography className={classes.heading}>
                        کارتی ها
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {!!payments.banks.length && (
                        <Grid item xs={12}>
                          <Paper>
                            <TableContainer style={{ padding: "0 10px" }}>
                              <Table
                                className={classes.table}
                                size={"medium"}
                                style={{ paddingRight: 10 }}
                              >
                                <TableHeader headCells={cardPayHeadCells} />

                                <TableBody>
                                  {payments.banks.map((row) => {
                                    return (
                                      <TableRow
                                        hover
                                        tabIndex={-1}
                                        key={row.id}
                                        style={{ paddingRight: 10 }}
                                      >
                                        <TableCell padding="none">
                                          <div
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                            }}
                                          >
                                            {row.cash.label}
                                          </div>
                                        </TableCell>
                                        <TableCell padding="none">
                                          {row.price}
                                        </TableCell>
                                        <TableCell padding="none">
                                          {row.bank.label}
                                        </TableCell>
                                        <TableCell padding="none">
                                          {row.trackingCode}
                                        </TableCell>

                                        <TableCell
                                          padding="none"
                                          style={{ textAlign: "left" }}
                                        >
                                          <IconButton
                                            onClick={() =>
                                              handleEditPayment(row, "CARD")
                                            }
                                          >
                                            <EditIcon />
                                          </IconButton>

                                          <IconButton
                                            onClick={() =>
                                              handleDeletePayment(row.id)
                                            }
                                          >
                                            <DeleteIcon />
                                          </IconButton>
                                        </TableCell>
                                      </TableRow>
                                    );
                                  })}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </Paper>
                        </Grid>
                      )}
                    </AccordionDetails>
                  </Accordion>
                  <Accordion
                    defaultExpanded={payments.cheques.lenght}
                    disabled={!payments.cheques.lenght}
                  >
                    <AccordionSummary
                      className={classes.accordionSummary}
                      expandIcon={
                        <i className="material-icons-round">expand_more</i>
                      }
                      aria-controls="panel3a-content"
                      id="panel3a-header"
                    >
                      <Typography className={classes.heading}>چک ها</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {!!payments.cheques.length && (
                        <Grid item xs={12}>
                          <Paper>
                            <TableContainer style={{ padding: "0 10px" }}>
                              <Table
                                className={classes.table}
                                size={"medium"}
                                style={{ paddingRight: 10 }}
                              >
                                <TableHeader headCells={checkPayHeadCells} />

                                <TableBody>
                                  {payments.cheques.map((row) => {
                                    return (
                                      <TableRow
                                        hover
                                        tabIndex={-1}
                                        key={row.id}
                                        style={{ paddingRight: 10 }}
                                      >
                                        <TableCell padding="none">
                                          <div
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                            }}
                                          >
                                            {row.cash.label}
                                          </div>
                                        </TableCell>
                                        <TableCell padding="none">
                                          {row.price}
                                        </TableCell>
                                        <TableCell padding="none">
                                          {row.bank.label}
                                        </TableCell>
                                        <TableCell padding="none">
                                          {row.chequeDueDate}
                                        </TableCell>

                                        <TableCell
                                          padding="none"
                                          style={{ textAlign: "left" }}
                                        >
                                          <IconButton
                                            onClick={() =>
                                              handleEditPayment(row, "CHECK")
                                            }
                                          >
                                            <EditIcon />
                                          </IconButton>

                                          <IconButton
                                            onClick={() =>
                                              handleDeletePayment(row.id)
                                            }
                                          >
                                            <DeleteIcon />
                                          </IconButton>
                                        </TableCell>
                                      </TableRow>
                                    );
                                  })}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </Paper>
                        </Grid>
                      )}
                    </AccordionDetails>
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
