import React, {
  Fragment,
  useEffect,
  useState,
  useImperativeHandle,
} from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Paper,
  Typography,
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
import { getQueryString } from "../../helpers/utils";
import dialogAction from "../../redux/actions/dialogAction";
import Payment from "./paymnet";
import update from "immutability-helper";

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
    id: "type",
    label: "نوع تراکنش ",
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

const PrePayment = React.forwardRef((props, ref) => {
  const { defaultValues } = props;
  const classes = useStyles();
  const paymentType = getQueryString("type");
  const [payments, setPayments] = useState();

  useImperativeHandle(ref, () => {
    return payments;
  });

  const onSubmitPaymentActions = (value, type, isEdit) => {
    if (isEdit) {
      return handleSubmitEditPayment(value, type);
    }
    return handleSubmitAddPayment(value, type);
  };

  const handleSubmitAddPayment = (value, type) => {
    let newPayments;
    const types = {
      NAGHD: () => {
        newPayments = update(payments, {
          cashes: { $push: [value] },
        });
      },
      CARD: () => {
        newPayments = update(payments, {
          banks: { $push: [value] },
        });
      },
      CHECK: () => {
        newPayments = update(payments, {
          cheques: { $push: [value] },
        });
      },
    };
    if (types[type]) {
      types[type]();
      setPayments(newPayments);
      dialogAction.hide();
    }
  };

  const handleSubmitEditPayment = (value, type) => {
    let newPayments;
    const types = {
      NAGHD: () => {
        const index = payments.cashes.findIndex((item) => item.id === value.id);
        newPayments = update(payments, {
          cashes: {
            [index]: { $set: value },
          },
        });
      },
      CARD: () => {
        const index = payments.banks.findIndex((item) => item.id === value.id);
        newPayments = update(payments, {
          banks: {
            [index]: { $set: value },
          },
        });
      },
      CHECK: () => {
        const index = payments.cheques.findIndex(
          (item) => item.id === value.id,
        );
        newPayments = update(payments, {
          cheques: {
            [index]: { $set: value },
          },
        });
      },
    };
    if (types[type]) {
      types[type]();
      setPayments(newPayments);
      dialogAction.hide();
    }
  };

  const handleDeletePayment = (value, type) => {
    dialogAction.show({
      confirm: true,
      title: "ایا از حذف این رکورد مطمئن هستید ؟",
      onAction: () => {
        let newPayments;
        const types = {
          NAGHD: () => {
            const index = payments.cashes.findIndex(
              (item) => item.id === value.id,
            );
            newPayments = update(payments, {
              cashes: { $splice: [[index, 1]] },
            });
          },
          CARD: () => {
            const index = payments.banks.findIndex(
              (item) => item.id === value.id,
            );
            newPayments = update(payments, {
              banks: { $splice: [[index, 1]] },
            });
          },
          CHECK: () => {
            const index = payments.cheques.findIndex(
              (item) => item.id === value.id,
            );
            newPayments = update(payments, {
              cheques: { $splice: [[index, 1]] },
            });
          },
        };
        if (types[type]) {
          types[type]();
          setPayments(newPayments);
          dialogAction.hide();
        }
      },
      size: "sm",
      disableCloseButton: false,
    });
  };

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
          onSubmit={onSubmitPaymentActions}
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
    const types = {
      NAGHD: () => {
        return (
          <Typography variant="button">
            {paymentType === "INCOME" ? "دریافت نقدی" : "پرداخت نقدی"}(
            {payments?.cashes.length})
          </Typography>
        );
      },
      CARD: () => {
        return (
          <Typography variant="button">
            {paymentType === "INCOME" ? "دریافت کارتی" : "پرداخت کارتی"}(
            {payments?.banks.length})
          </Typography>
        );
      },
      CHECK: () => {
        return (
          <Typography variant="button">
            {paymentType === "INCOME" ? "دریافت چکی" : "پرداخت چکی"}(
            {payments?.cheques.length})
          </Typography>
        );
      },
    };
    if (types[type]) {
      return types[type]();
    }
  };

  useEffect(() => {
    setPayments(defaultValues);
  }, [defaultValues]);

  useEffect(() => {
    if (typeof props.onSubmit === "function") {
      props.onSubmit(payments);
    }
  }, [payments]);

  return (
    <>
      <Grid item xs={12} style={{ display: "flex", justifyContent: "center" }}>
        <ButtonGroup color="primary">
          <Button
            startIcon={<i className="material-icons-round">local_atm</i>}
            onClick={() => onClickPayment("NAGHD")}
          >
            {getButtonTitle("NAGHD")}
          </Button>
          <Button
            startIcon={<i className="material-icons-round">payment</i>}
            onClick={() => onClickPayment("CARD")}
          >
            {getButtonTitle("CARD")}
          </Button>
          <Button
            startIcon={<i className="material-icons-round">payments</i>}
            onClick={() => onClickPayment("CHECK")}
          >
            {getButtonTitle("CHECK")}
          </Button>
        </ButtonGroup>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Accordion
            expanded={payments?.cashes.length}
            disabled={!payments?.cashes.length}
          >
            <AccordionSummary
              className={classes.accordionSummary}
              expandIcon={<i className="material-icons-round">expand_more</i>}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className={classes.heading}>نقدی ها</Typography>
            </AccordionSummary>
            {!!payments?.cashes.length && (
              <AccordionDetails>
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
                          {payments?.cashes.map((row) => {
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
                                    {row.cashDesk?.label}
                                  </div>
                                </TableCell>
                                <TableCell padding="none">
                                  {row.price}
                                </TableCell>

                                <TableCell
                                  padding="none"
                                  style={{ textAlign: "left" }}
                                >
                                  <IconButton
                                    onClick={() => onClickPayment("NAGHD", row)}
                                  >
                                    <EditIcon />
                                  </IconButton>

                                  <IconButton
                                    onClick={() =>
                                      handleDeletePayment(row, "NAGHD")
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
              </AccordionDetails>
            )}
          </Accordion>
          <Accordion
            expanded={payments?.banks.length}
            disabled={!payments?.banks.length}
          >
            <AccordionSummary
              className={classes.accordionSummary}
              expandIcon={<i className="material-icons-round">expand_more</i>}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography className={classes.heading}>کارتی ها</Typography>
            </AccordionSummary>
            {!!payments?.banks.length && (
              <AccordionDetails>
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
                          {payments?.banks.map((row) => {
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
                                    {row.cashDesk?.label}
                                  </div>
                                </TableCell>
                                <TableCell padding="none">
                                  {row.price}
                                </TableCell>
                                <TableCell padding="none">
                                  {row.transactionType}
                                </TableCell>
                                <TableCell padding="none">
                                  {row.bank?.label}
                                </TableCell>
                                <TableCell padding="none">
                                  {row.trackingCode}
                                </TableCell>

                                <TableCell
                                  padding="none"
                                  style={{ textAlign: "left" }}
                                >
                                  <IconButton
                                    onClick={() => onClickPayment("CARD", row)}
                                  >
                                    <EditIcon />
                                  </IconButton>

                                  <IconButton
                                    onClick={() =>
                                      handleDeletePayment(row, "CARD")
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
              </AccordionDetails>
            )}
          </Accordion>
          <Accordion
            expanded={payments?.cheques.length}
            disabled={!payments?.cheques.length}
          >
            <AccordionSummary
              className={classes.accordionSummary}
              expandIcon={<i className="material-icons-round">expand_more</i>}
              aria-controls="panel3a-content"
              id="panel3a-header"
            >
              <Typography className={classes.heading}>چک ها</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {!!payments?.cheques.length && (
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
                          {payments?.cheques.map((row) => {
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
                                    {row.cashDesk?.label}
                                  </div>
                                </TableCell>
                                <TableCell padding="none">
                                  {row.price}
                                </TableCell>

                                <TableCell padding="none">
                                  {row.chequeDueDate.toLocaleDateString(
                                    "fa-IR",
                                  )}
                                </TableCell>
                                <TableCell padding="none">
                                  {row.bank?.label}
                                </TableCell>
                                <TableCell
                                  padding="none"
                                  style={{ textAlign: "left" }}
                                >
                                  <IconButton
                                    onClick={() => onClickPayment("CHECK", row)}
                                  >
                                    <EditIcon />
                                  </IconButton>

                                  <IconButton
                                    onClick={() =>
                                      handleDeletePayment(row, "CHECK")
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
      </Grid>
    </>
  );
});
export default PrePayment;
