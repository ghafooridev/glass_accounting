import React, { useEffect, useState, useImperativeHandle } from "react";
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
  TextField,
  MenuItem,
} from "@material-ui/core";
import { useForm, Controller } from "react-hook-form";
import TableHeader from "../../components/Table/TableHead";
import { DeleteIcon, EditIcon } from "../../components/icons";
import { getQueryString, persianNumber } from "../../helpers/utils";
import dialogAction from "../../redux/actions/dialogAction";
import Payment from "./paymnet";
import update from "immutability-helper";
import Constant from "../../helpers/constant";
import { useApi } from "../../hooks/useApi";
import moment from "moment";
import { DatePicker } from "@material-ui/pickers";
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
  const { control, handleSubmit, errors, reset } = useForm();

  const { defaultValues } = props;
  const classes = useStyles();
  const paymentType = getQueryString("type");
  const [payments, setPayments] = useState();
  const [banks, setBanks] = useState([]);
  const [chequeDueDate, handleChequeDueDateChange] = useState(moment());

  useImperativeHandle(ref, () => {
    return { payments: { cashe: naghd, bank: card, cheque } };
  });

  // const onSubmitPaymentActions = (value, type, isEdit) => {
  //   if (isEdit) {
  //     return handleSubmitEditPayment(value, type);
  //   }
  //   return handleSubmitAddPayment(value, type);
  // };

  // const handleSubmitAddPayment = (value, type) => {
  //   let newPayments;
  //   const types = {
  //     NAGHD: () => {
  //       newPayments = update(payments, {
  //         cashes: { $push: [value] },
  //       });
  //     },
  //     CARD: () => {
  //       newPayments = update(payments, {
  //         banks: { $push: [value] },
  //       });
  //     },
  //     CHECK: () => {
  //       newPayments = update(payments, {
  //         cheques: { $push: [value] },
  //       });
  //     },
  //   };
  //   if (types[type]) {
  //     types[type]();
  //     setPayments(newPayments);
  //     dialogAction.hide({ name: "prePayment" });
  //   }
  // };

  // const handleSubmitEditPayment = (value, type) => {
  //   let newPayments;
  //   const types = {
  //     NAGHD: () => {
  //       const index = payments.cashes.findIndex((item) => item.id === value.id);
  //       newPayments = update(payments, {
  //         cashes: {
  //           [index]: { $set: value },
  //         },
  //       });
  //     },
  //     CARD: () => {
  //       const index = payments.banks.findIndex((item) => item.id === value.id);
  //       newPayments = update(payments, {
  //         banks: {
  //           [index]: { $set: value },
  //         },
  //       });
  //     },
  //     CHECK: () => {
  //       const index = payments.cheques.findIndex(
  //         (item) => item.id === value.id,
  //       );
  //       newPayments = update(payments, {
  //         cheques: {
  //           [index]: { $set: value },
  //         },
  //       });
  //     },
  //   };
  //   if (types[type]) {
  //     types[type]();
  //     setPayments(newPayments);
  //     dialogAction.hide({ name: "prePayment" });
  //   }
  // };

  useEffect(() => {
    setPayments(defaultValues);
  }, [defaultValues]);

  useEffect(() => {
    if (typeof props.onSubmit === "function") {
      props.onSubmit(payments);
    }
  }, [payments]);

  const getBankRequest = useApi({
    method: "get",
    url: `bank`,
  });

  const getBanks = async () => {
    const result = await getBankRequest.execute();
    setBanks(result.data);
  };

  const [selectedTransaction, setSelectedTransaction] = useState(
    defaultValues?.transactionType,
  );
  const [selectedChequeBank, setSelectedChequeBank] = useState(
    defaultValues?.bankId || 1,
  );
  const [selectedCardBank, setSelectedCardBank] = useState(
    defaultValues?.bankId || 1,
  );
  const onChangeBank = (e, type) => {
    if (type === "C") {
      return setSelectedChequeBank(e.target.value);
    }
    setSelectedCardBank(e.target.value);
  };
  const onChangeTransaction = (e) => {
    setSelectedTransaction(e.target.value);
  };

  const [naghd, setNaghd] = useState({});
  const [card, setCard] = useState({});
  const [cheque, setCheque] = useState({});

  const onChange = (type, field, value) => {
    if (type === "N") {
      setNaghd({ price: value });
    }
    if (type === "B") {
      if (field === "price") {
        setCard({
          ...card,
          transactionType: selectedTransaction,
          bank: selectedCardBank,
          price: value,
        });
      }
      if (field === "cardNO") {
        setCard({
          ...card,
          transactionType: selectedTransaction,
          bank: selectedCardBank,
          cardNumber: value,
        });
      }
    }

    if (type === "C") {
      if (field === "price") {
        setCheque({
          ...cheque,
          chequeDueDate: chequeDueDate._d,
          bank: selectedChequeBank,
          price: value,
        });
      }
      if (field === "chequeNO") {
        setCheque({
          ...cheque,
          chequeDueDate: chequeDueDate._d,
          bank: selectedChequeBank,
          chequeNO: value,
        });
      }
      if (field === "branch") {
        setCheque({
          ...cheque,
          chequeDueDate: chequeDueDate._d,
          bank: selectedChequeBank,
          branch: value,
        });
      }
      if (field === "vajeh") {
        setCheque({
          ...cheque,
          chequeDueDate: chequeDueDate._d,
          bank: selectedChequeBank,
          vajeh: value,
        });
      }
    }
    // let newPayments;
    // const types = {
    //   NAGHD: () => {
    //     const data = { price: value };
    //     const index = payments.cashes.findIndex((item) => item.id === value.id);
    //     newPayments = update(payments, {
    //       cashes: {
    //         [index]: { $set: data },
    //       },
    //     });
    //   },
    //   CARD: () => {
    //     const data = { price: value };
    //     const index = payments.banks.findIndex((item) => item.id === value.id);
    //     newPayments = update(payments, {
    //       banks: {
    //         [index]: { $set: value },
    //       },
    //     });
    //   },
    //   CHECK: () => {
    //     const index = payments.cheques.findIndex(
    //       (item) => item.id === value.id,
    //     );
    //     newPayments = update(payments, {
    //       cheques: {
    //         [index]: { $set: value },
    //       },
    //     });
    //   },
    // };

    // if (types[type]) {
    //   types[type]();
    //   setPayments(newPayments);
    // }
  };

  useEffect(() => {
    getBanks();
  }, []);

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Accordion
            expanded={true}
            style={{ boxShadow: "0 3px 10px rgb(0 0 0 / 0.2)" }}
          >
            <AccordionSummary
              className={classes.accordionSummary}
              expandIcon={<i className="material-icons-round">expand_more</i>}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className={classes.heading}>نقدی </Typography>
            </AccordionSummary>

            <AccordionDetails>
              <Grid item xs={12}>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <TextField
                      variant="outlined"
                      label="مبلغ نقدی"
                      type="number"
                      onChange={(e) => onChange("N", "price", e.target.value)}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={true}
            style={{ boxShadow: "0 3px 10px rgb(0 0 0 / 0.2)" }}
          >
            <AccordionSummary
              className={classes.accordionSummary}
              expandIcon={<i className="material-icons-round">expand_more</i>}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography className={classes.heading}>کارتی </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <TextField
                    select
                    label="نوع تراکنش"
                    onChange={onChangeTransaction}
                    value={selectedTransaction}
                    variant="outlined"
                    fullWidth
                    size="small"
                    name="cash"
                  >
                    {Constant.BANK_TRANSACTION_TYPE.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    variant="outlined"
                    label="مبلغ "
                    type="number"
                    onChange={(e) => onChange("B", "price", e.target.value)}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    variant="outlined"
                    label="شماره کارت/شبا"
                    number
                    onChange={(e) => onChange("B", "cardNO", e.target.value)}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    select
                    label="بانک"
                    onChange={onChangeBank}
                    value={selectedCardBank}
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
          <Accordion
            expanded={true}
            style={{ boxShadow: "0 3px 10px rgb(0 0 0 / 0.2)" }}
          >
            <AccordionSummary
              className={classes.accordionSummary}
              expandIcon={<i className="material-icons-round">expand_more</i>}
              aria-controls="panel3a-content"
              id="panel3a-header"
            >
              <Typography className={classes.heading}>چک </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={4}>
                  <TextField
                    variant="outlined"
                    label="مبلغ چک"
                    type="number"
                    onChange={(e) => onChange("C", "price", e.target.value)}
                    helperText={errors.price ? errors.price.message : ""}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    variant="outlined"
                    label="شماره چک"
                    number
                    onChange={(e) => onChange("C", "chequeNO", e.target.value)}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    select
                    label="بانک"
                    onChange={onChangeBank}
                    value={selectedChequeBank}
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
                <Grid item xs={4}>
                  <TextField
                    variant="outlined"
                    label="شعبه"
                    number
                    onChange={(e) => onChange("C", "branch", e.target.value)}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={4} className={classes.datePicker}>
                  <DatePicker
                    name="date"
                    label="تاریخ سررسید"
                    inputVariant="outlined"
                    okLabel="تأیید"
                    cancelLabel="لغو"
                    labelFunc={(date) =>
                      date ? date.format("jYYYY/jMM/jDD") : ""
                    }
                    value={chequeDueDate}
                    onChange={handleChequeDueDateChange}
                    style={{ width: "100%" }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    variant="outlined"
                    label="در وجه"
                    number
                    onChange={(e) => onChange("C", "vajeh", e.target.value)}
                    fullWidth
                    size="small"
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    </>
  );
});
export default PrePayment;
