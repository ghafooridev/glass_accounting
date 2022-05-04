import React, { Fragment, useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Paper, Typography, TextField, Button } from "@material-ui/core";
import { useForm, Controller } from "react-hook-form";
import { useApi } from "../../hooks/useApi";
import { getQueryString } from "../../helpers/utils";
import { DatePicker } from "@material-ui/pickers";
import moment from "moment";
import dialogAction from "../../redux/actions/dialogAction";
import PrePayment from "../payment/prePayment";
import Product from "./productFastInvoice";
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

export default function MainDetail() {
  const productsRef = useRef(null);
  const paymentRef = useRef(null);
  const classes = useStyles();
  const history = useHistory();
  const invoiceType = getQueryString("type");
  const { control, handleSubmit, errors, reset } = useForm();
  const [selectedDate, handleDateChange] = useState(moment());
  const [products, setProducts] = useState([]);
  const [invoicePerson, setInvoicePerson] = useState(" ");
  const [payments, setPayments] = useState({
    cashes: [],
    banks: [],
    cheques: [],
  });
  const [totalFee, setTotalFee] = useState(0);
  const [allCustomers, setAllCustomers] = useState([]);
  const [totalPayment, setTotalPayment] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [pureFee, setPureFee] = useState(0);
  const [totalRemaining, setTotalRemaining] = useState(0);
  const [allDrivers, setAllDrivers] = useState([]);

  const addInvoiceRequest = useApi({
    method: "post",
    url: `invoice`,
  });

  const addInvoicePaymentRequest = useApi({
    method: "post",
    url: `payment`,
  });

  const onChnageDate = (e) => {
    handleDateChange(e);
  };

  const getProperProducts = () => {
    const newProducts = [];
    productsRef.current.map((item) => {
      item.productId = item.id;

      if (item.fee && item.amount) {
        return newProducts.push(item);
      }
    });
    return newProducts;
  };

  const onSubmit = async (data) => {
    const value = {
      ...data,
      products: getProperProducts(),
      date: selectedDate._d,
      customerId: 1,
      type: invoiceType,
      categoryId: [1],
      globalCustomer: invoicePerson.trim(),
    };
    console.log(paymentRef.current);
    // const response = await addInvoiceRequest.execute(value);

    // const invoicePayment = {
    //   ...paymentRef.current,
    //   invoiceId: response.id,
    //   date: selectedDate._d,
    //   personId: 1,
    //   personType: "CUSTOMER",
    //   type: invoiceType === "SELL" ? "INCOME" : "OUTCOME",
    //   // description: `بابت فاکتور به شماره  ${response.id}`,
    // };

    // if (
    //   invoicePayment.cashes.length > 0 ||
    //   invoicePayment.cheques.length > 0 ||
    //   invoicePayment.banks.length > 0
    // ) {
    //   await addInvoicePaymentRequest.execute(invoicePayment);
    // }

    // setTimeout(() => {
    //   onReject();
    // }, 1000);
  };

  const onReject = () => {
    history.push("/app/invoice-list?type=ALL");
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
    onDismissProduct();
  };

  const onDismissProduct = () => {
    dialogAction.hide({ name: "product" });
  };

  const onShowProductDialog = (type, data) => {
    dialogAction.show({
      title: "انتخاب کالا",
      component: (
        <Product
          onSubmit={onSubmitProduct}
          onDismiss={onDismissProduct}
          customerId={1}
          defaultValues={data}
          action={type}
        />
      ),
      name: "product",
      size: "6",
      confirm: false,
      disableCloseButton: true,
    });
  };

  const getDetailTitle = () => {
    if (invoiceType === "SELL") {
      return "افزودن فاکتور فروش";
    }
    return "افزودن فاکتور خرید";
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

  const getCustomerRequest = useApi({
    method: "get",
    url: "customer",
  });

  const getDriverRequest = useApi({
    method: "get",
    url: `driver`,
  });

  const getAllCustomers = async () => {
    const customerList = await getCustomerRequest.execute();
    setAllCustomers(customerList.data);
  };

  const getAllDrivers = async () => {
    const driverList = await getDriverRequest.execute();
    setAllDrivers(driverList.data);
  };

  const onDiscountChange = (e) => {
    setDiscount(e.target.value);
  };

  const onChangeInvoicePerson = (e) => {
    setInvoicePerson(e.target.value);
  };

  useEffect(() => {
    setTotalFee(products.reduce((n, { totalFee }) => n + totalFee, 0));
  }, [products]);

  useEffect(() => {
    getAllCustomers();
    getAllDrivers();
  }, []);

  useEffect(() => {
    const factorPay = totalFee - (Number(discount) + totalPayment);

    setPureFee(factorPay);
  }, [totalFee, discount, totalPayment]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid item lg={10} sm={12} className={classes.root}>
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
                <Autocomplete
                  id="combo-box-demo"
                  options={allCustomers}
                  getOptionLabel={(option) =>
                    `${option.firstName} - ${option.lastName}`
                  }
                  style={{ width: "100%", height: 50 }}
                  renderInput={(params) => (
                    <TextField
                      style={{
                        width: "100%",
                        height: 50,
                      }}
                      {...params}
                      label="مشتریان"
                      variant="outlined"
                    />
                  )}
                />
                {/* <TextField
                  label="نام مشتری"
                  variant="outlined"
                  name={"personName"}
                  onChange={onChangeInvoicePerson}
                  value={invoicePerson}
                  fullWidth
                  size="small"
                /> */}
              </Grid>
              <Grid item lg={6} xs={12}>
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

              <Grid container style={{ margin: "20px 10px" }}>
                <Product
                  onSubmit={onSubmitProduct}
                  onDismiss={onDismissProduct}
                  customerId={1}
                  ref={productsRef}
                />
              </Grid>

              <PrePayment
                type={invoiceType === "BUY" ? "OUTCOME" : "INCOME"}
                defaultValues={payments}
                ref={paymentRef}
                onSubmit={onSubmitPayment}
              />
              <Grid container spacing={3} style={{ marginTop: 20 }}>
                <Grid item lg={6} xs={12}>
                  <Autocomplete
                    id="combo-box-demo"
                    options={allDrivers}
                    getOptionLabel={(option) =>
                      `${option.firstName} - ${option.lastName}`
                    }
                    style={{ width: "100%", height: 50, marginBottom: 50 }}
                    renderInput={(params) => (
                      <TextField
                        style={{
                          width: "100%",
                          height: 50,
                        }}
                        {...params}
                        label="راننده"
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>
                <Grid item lg={3} xs={6}>
                  <TextField
                    label="کرایه تنی"
                    variant="outlined"
                    name={"personName"}
                    onChange={onChangeInvoicePerson}
                    value={invoicePerson}
                    fullWidth
                    type="number"
                  />
                </Grid>
                <Grid item lg={3} xs={6}>
                  <TextField
                    label="کرایه کلی"
                    variant="outlined"
                    name={"personName"}
                    onChange={onChangeInvoicePerson}
                    value={invoicePerson}
                    fullWidth
                    type="number"
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3} style={{ margin: "20px 5px" }}>
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
    </form>
  );
}
