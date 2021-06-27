import React, { Fragment, useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableContainer,
  TableCell,
  TableRow,
  IconButton,
  Chip,
  MenuItem,
  Hidden,
} from "@material-ui/core";
import TableHeader from "../../components/Table/TableHead";
import { DeleteIcon, EditIcon } from "../../components/icons";
import { useForm, Controller } from "react-hook-form";
import { useApi } from "../../hooks/useApi";
import { getQueryString, persianNumber } from "../../helpers/utils";
import CircularProgress from "../../components/CircularProgress";
import PersonSelector from "../payment/personSelector";
import { DatePicker } from "@material-ui/pickers";
import moment from "moment";
import dialogAction from "../../redux/actions/dialogAction";
import OtherPayments from "./OtherPayments";
import PrePayment from "../payment/prePayment";
import Drivers from "./driver";
import Product from "./product";
import Constant from "../../helpers/constant";

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

const headCells = [
  {
    id: "name",
    label: "نام کالا",
  },
  { id: "unit", label: "واحد" },
  {
    id: "amount",
    label: "مقدار",
  },
  {
    id: "fee",
    label: "قیمت",
  },
  {
    id: "total",
    label: "مجموع",
  },

  { id: "action" },
];

export default function MainDetail({ defaultValues }) {
  const paymentRef = useRef(null);
  const classes = useStyles();
  const history = useHistory();
  const id = getQueryString("id");
  const invoiceType = getQueryString("type");
  const [detail, setDetail] = useState({});
  const [selectedPerson, setSelectedPerson] = useState();
  const { control, handleSubmit, errors, reset } = useForm();
  const [selectedDate, handleDateChange] = useState(moment());
  const [invoiceCategory, setInvoiceCategory] = useState(3);
  const [category, setCategory] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [products, setProducts] = useState([]);
  const [invoicePerson, setInvoicePerson] = useState(" ");
  const [payments, setPayments] = useState({
    cashes: [],
    banks: [],
    cheques: [],
  });
  const [totalFee, setTotalFee] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [pureFee, setPureFee] = useState(0);
  const [totalRemaining, setTotalRemaining] = useState(0);

  const addInvoiceRequest = useApi({
    method: "post",
    url: `invoice`,
  });
  const editInvoiceRequest = useApi({
    method: "put",
    url: `invoice/${id}`,
  });
  const detailInvoiceRequest = useApi({
    method: "get",
    url: `invoice/${id}`,
  });
  const invoiceCategoryRequest = useApi({
    method: "get",
    url: `invoice/category`,
  });
  const addInvoicePaymentRequest = useApi({
    method: "post",
    url: `payment`,
  });
  const getPaymentInvoiceRequest = useApi({
    method: "get",
    url: `payment/invoice/${id}`,
  });

  const onChnageDate = (e) => {
    handleDateChange(e);
  };

  const getInvoiceCategory = async () => {
    const detail = await invoiceCategoryRequest.execute();
    setCategory(detail.data);
  };

  const onSelectPerson = (person) => {
    setSelectedPerson(person);
    setInvoicePerson(selectedPerson ? `${selectedPerson.name}` : "");
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
    const value = {
      ...data,
      products,
      drivers,
      date: selectedDate._d,
      customerId: selectedPerson ? selectedPerson.id : 1,
      type: invoiceType,
      categoryId: invoiceCategory,
      globalCustomer: invoicePerson,
    };
    if (id) {
      await editInvoiceRequest.execute(value);
    } else {
      const response = await addInvoiceRequest.execute(value);
      const invoicePayment = {
        ...paymentRef.current,
        invoiceId: response.id,
        date: selectedDate._d,
        personId: selectedPerson ? selectedPerson.id : 1,
        personType: "CUSTOMER",
        type: invoiceType === "SELL" ? "INCOME" : "OUTCOME",
        description: `بابت فاکتور به شماره  ${response.id}`,
      };
      addInvoicePaymentRequest.execute(invoicePayment);
    }
  };

  const onReject = () => {
    history.push("/app/invoice-list?type=ALL");
  };

  const getDetail = async () => {
    const detail = await detailInvoiceRequest.execute();
    const payments = await getPaymentInvoiceRequest.execute();
    const paymentsArray = {
      cashes: payments.data.cashes,
      banks: payments.data.banks,
      cheques: payments.data.cheques,
    };

    setDetail(detail.data);
    setSelectedPerson(payments.data.person);
    setPayments(paymentsArray);
    setDrivers(detail.data.drivers);
    setProducts(detail.data.products);
    handleDateChange(detail.data.date);
    setTotalFee(detail.data.totalPrice);
    setDiscount(detail.data.discount);
    setTotalPayment(payments.data.price);
    setTotalRemaining(
      detail.data.totalPrice -
        (detail.data.discount + payments.data.price) +
        Number(payments.data.person.accountRemaining),
    );
    if (detail.data.customerId === 1) {
      setInvoicePerson(detail.data.globalCustomer);
    }
  };

  const onSubmitDrivers = (drivers) => {
    setDrivers(drivers);
    dialogAction.hide();
  };

  const onDismissDrivers = () => {
    dialogAction.hide();
  };

  const handleDeleteDriver = (data) => {
    setDrivers(drivers.filter((item) => item.id !== data.id));
  };

  const onShowDriverDialog = () => {
    dialogAction.show({
      title: "انتخاب راننده",
      component: (
        <Drivers
          onSelect={onSubmitDrivers}
          onDismiss={onDismissDrivers}
          defaultValues={drivers}
        />
      ),
      size: "lg",
      confirm: false,
      disableCloseButton: true,
    });
  };

  const onSubmitProduct = (product, type) => {
    if (type === "edit") {
      const index = products.findIndex((item) => item.id === product.id);
      const ProductsTmp = [...products];
      ProductsTmp[index] = product;
      setProducts(ProductsTmp);
    } else {
      setProducts([...products, product]);
    }
    dialogAction.hide();
  };

  const onDismissProduct = () => {
    dialogAction.hide();
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter((item) => item.id !== id));
  };

  const handleEditProduct = (item) => {
    onShowProductDialog("edit", item);
  };

  const onShowProductDialog = (type, data) => {
    dialogAction.show({
      title: "انتخاب کالا",
      component: (
        <Product
          onSubmit={onSubmitProduct}
          onDismiss={onDismissProduct}
          customerId={selectedPerson ? selectedPerson.id : 1}
          defaultValues={data}
          action={type}
        />
      ),
      size: "lg",
      confirm: false,
      disableCloseButton: true,
    });
  };

  const getDetailTitle = () => {
    if (id) {
      if (invoiceType === "BUY") {
        return "ویرایش فاکتور خرید";
      }
      return "ویرایش فاکتور فروش";
    } else {
      if (invoiceType === "INCOME") {
        return "افزودن فاکتور خرید";
      }
      return "افزودن فاکتور فروش";
    }
  };

  const onSubmitPayment = (data) => {
    if (data) {
      const cashesPrice = data.cashes.reduce(
        (n, { price }) => n + Number(price),
        0,
      );
      const chequesPrice = data.cheques.reduce(
        (n, { price }) => n + Number(price),
        0,
      );
      const banksPrice = data.banks.reduce(
        (n, { price }) => n + Number(price),
        0,
      );
      setTotalPayment(cashesPrice + chequesPrice + banksPrice);
    }
  };

  const onDiscountChange = (e) => {
    setDiscount(e.target.value);
  };

  const onChangeCategory = (e) => {
    setInvoiceCategory(e.target.value);
  };

  const onChangeInvoicePerson = (e) => {
    setInvoicePerson(e.target.value);
  };

  const onDismissOtherPayments = () => {
    dialogAction.hide();
  };

  const onSubmitOtherPayments = (data) => {
    console.log(data);
  };

  const onOtherPayments = () => {
    // dialogAction.show({
    //   title: "انتخاب کالا",
    //   component: (
    //     <OtherPayments
    //       onSubmit={onSubmitOtherPayments}
    //       onDismiss={onDismissOtherPayments}
    //     />
    //   ),
    //   size: "lg",
    //   confirm: false,
    //   disableCloseButton: true,
    // });
  };

  useEffect(() => {
    getInvoiceCategory();
    if (id) {
      getDetail();
    }
  }, []);

  useEffect(() => {
    setTotalFee(products.reduce((n, { totalFee }) => n + totalFee, 0));
  }, [products]);

  useEffect(() => {
    const factorPay = totalFee - (Number(discount) + totalPayment);

    setPureFee(factorPay);
    if (selectedPerson) {
      setTotalRemaining(factorPay + Number(selectedPerson?.accountRemaining));
    }
  }, [totalFee, discount, totalPayment]);

  useEffect(() => {
    reset(detail);
  }, [reset, detail]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {!detailInvoiceRequest.pending ? (
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
                    انتخاب مشتری
                  </Button>

                  <TextField
                    variant="outlined"
                    name={"personName"}
                    onChange={onChangeInvoicePerson}
                    value={invoicePerson}
                    style={{ width: "70%" }}
                    size="small"
                  />
                </Grid>
                <Grid item lg={6} xs={12} className={classes.datePicker}>
                  <DatePicker
                    autoOk
                    name="date"
                    label="تاریخ ثبت"
                    inputVariant="outlined"
                    okLabel="تأیید"
                    cancelLabel="لغو"
                    labelFunc={(date) =>
                      date ? date.format("jYYYY/jMM/jDD") : ""
                    }
                    value={selectedDate}
                    onChange={onChnageDate}
                    style={{ width: "100%" }}
                  />
                </Grid>
                <Grid item lg={6} xs={12}>
                  {!!category.length && invoiceCategory && (
                    <TextField
                      select
                      label="دسته بندی"
                      value={invoiceCategory}
                      onChange={onChangeCategory}
                      variant="outlined"
                      fullWidth
                      size="small"
                    >
                      {category.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                </Grid>
                <Hidden smDown>
                  <Grid item lg={6} xs={12} />
                </Hidden>
                <Grid item lg={6} xs={12}>
                  <Controller
                    control={control}
                    render={({ onChange, value, name }) => {
                      return (
                        <TextField
                          variant="outlined"
                          label="مبدا"
                          name={name}
                          onChange={onChange}
                          value={value || " "}
                          error={!!errors.origin}
                          helperText={
                            errors.origin ? errors.origin.message : ""
                          }
                          fullWidth
                          size="small"
                        />
                      );
                    }}
                    name="origin"
                  />
                </Grid>
                <Grid item lg={6} xs={12}>
                  <Controller
                    control={control}
                    render={({ onChange, value, name }) => {
                      return (
                        <TextField
                          variant="outlined"
                          label="مقصد"
                          name={name}
                          onChange={onChange}
                          value={value || " "}
                          error={!!errors.destination}
                          helperText={
                            errors.destination ? errors.destination.message : ""
                          }
                          fullWidth
                          size="small"
                        />
                      );
                    }}
                    name="destination"
                  />
                </Grid>
                <Grid item lg={6} xs={12} style={{ display: "flex" }}>
                  <Button
                    style={{ marginLeft: 10, width: "30%" }}
                    variant="contained"
                    color="primary"
                    onClick={onShowDriverDialog}
                    endIcon={
                      <i className="material-icons-round">local_shipping</i>
                    }
                    inventory_2
                  >
                    انتخاب راننده
                  </Button>
                  <Grid>
                    {drivers.map((item) => {
                      return (
                        <Chip
                          style={{ margin: "0 1px 4px" }}
                          label={`${item.firstName} ${item.lastName}`}
                          onDelete={() => handleDeleteDriver(item)}
                          color="primary"
                        />
                      );
                    })}
                  </Grid>
                </Grid>

                <Grid item lg={6} xs={12} style={{ display: "flex" }}>
                  <Button
                    // disabled={isEmpty(selectedPerson)}
                    style={{ marginLeft: 10, width: "30%" }}
                    variant="contained"
                    color="primary"
                    onClick={() => onShowProductDialog("add")}
                    endIcon={
                      <i className="material-icons-round">inventory_2</i>
                    }
                  >
                    انتخاب کالا
                  </Button>
                </Grid>
                {!!products.length && (
                  <Grid item xs={12}>
                    <Paper>
                      <TableContainer style={{ padding: "0 10px" }}>
                        <Table
                          className={classes.table}
                          size={"medium"}
                          style={{ paddingRight: 10 }}
                        >
                          <TableHeader headCells={headCells} />

                          <TableBody>
                            {products.map((row) => {
                              return (
                                <TableRow
                                  hover
                                  tabIndex={-1}
                                  key={row.id}
                                  style={{ paddingRight: 10 }}
                                >
                                  <TableCell padding="none">
                                    {row.name}
                                  </TableCell>
                                  <TableCell padding="none">
                                    {Constant.UNITS_MAP[row.unit]}
                                  </TableCell>
                                  <TableCell padding="none">
                                    {row.perUnit
                                      ? `${persianNumber(
                                          row.amount,
                                        )}*${persianNumber(row.perUnit)}`
                                      : persianNumber(row.amount)}
                                  </TableCell>
                                  <TableCell padding="none">
                                    {persianNumber(row.fee)}
                                  </TableCell>
                                  <TableCell padding="none">
                                    {persianNumber(row.fee * row.amount)}
                                  </TableCell>
                                  <TableCell
                                    padding="none"
                                    style={{ textAlign: "left" }}
                                  >
                                    <IconButton
                                      onClick={() => handleEditProduct(row)}
                                    >
                                      <EditIcon />
                                    </IconButton>

                                    <IconButton
                                      onClick={() =>
                                        handleDeleteProduct(row.id)
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
                <Grid item xs={12}>
                  <Controller
                    control={control}
                    render={({ onChange, value, name }) => {
                      return (
                        <TextField
                          variant="outlined"
                          label="توضیحات"
                          name={name}
                          onChange={onChange}
                          value={value || " "}
                          error={!!errors.description}
                          helperText={
                            errors.description ? errors.description.message : ""
                          }
                          fullWidth
                          multiline
                          size="small"
                        />
                      );
                    }}
                    name="description"
                  />
                </Grid>
                <PrePayment
                  type={invoiceType === "BUY" ? "OUTCOME" : "INCOME"}
                  defaultValues={payments}
                  ref={paymentRef}
                  onSubmit={onSubmitPayment}
                />
                <Grid container spacing={3} style={{ marginTop: 20 }}>
                  <Grid item lg={3} xs={6}>
                    <TextField
                      disabled
                      variant="outlined"
                      label="مبلغ کل"
                      value={totalFee}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item lg={3} xs={6}>
                    <TextField
                      disabled
                      variant="outlined"
                      label={`${
                        invoiceType === "SELL" ? "جمع دریافتی" : "جمع پرداختی"
                      }`}
                      value={totalPayment}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item lg={3} xs={6}>
                    <TextField
                      variant="outlined"
                      onChange={onDiscountChange}
                      label="تخفیف"
                      value={discount || " "}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item lg={3} xs={6}>
                    <TextField
                      disabled
                      variant="outlined"
                      label="مبلغ خالص"
                      value={pureFee}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  {selectedPerson && (
                    <Grid item lg={3} xs={6}>
                      <TextField
                        disabled
                        variant="outlined"
                        label="مانده قبلی"
                        value={
                          selectedPerson ? selectedPerson.accountRemaining : 0
                        }
                        fullWidth
                        size="small"
                      />
                    </Grid>
                  )}
                  <Grid item lg={3} xs={6}>
                    <TextField
                      disabled
                      variant="outlined"
                      label="مانده نهایی"
                      value={totalRemaining}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                </Grid>
                <Grid
                  item
                  xs={12}
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Button variant="contained" color="primary" type="submit">
                    تایید
                  </Button>
                  {/* <Button
                    variant="outlined"
                    color="primary"
                    type="button"
                    endIcon={
                      <i className="material-icons-round">attach_money</i>
                    }
                    onClick={onOtherPayments}
                  >
                    پرداخت متفرقه
                  </Button> */}
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
