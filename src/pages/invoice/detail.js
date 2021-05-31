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
} from "@material-ui/core";
import TableHeader from "../../components/Table/TableHead";
import { DeleteIcon, EditIcon } from "../../components/icons";
import { useForm, Controller } from "react-hook-form";
import { useApi } from "../../hooks/useApi";
import { getQueryString } from "../../helpers/utils";
import CircularProgress from "../../components/CircularProgress";
import PersonSelector from "../payment/personSelector";
import { DatePicker } from "@material-ui/pickers";
import moment from "moment";
import dialogAction from "../../redux/actions/dialogAction";
import isEmpty from "lodash.isempty";
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
  const [drivers, setDrivers] = useState([]);
  const [products, setProducts] = useState([]);
  const [payments, setPayments] = useState({
    cashes: [],
    banks: [],
    cheques: [],
  });

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

  const onSelectPerson = (person) => {
    setSelectedPerson(person);
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
    if (id) {
      await editInvoiceRequest.execute(data);
    } else {
      await addInvoiceRequest.execute(data);
    }
  };

  const onReject = () => {
    history.push("/app/invoice-list?type=ALL");
  };

  const getDetail = async () => {
    const detail = await detailInvoiceRequest.execute();
    setDetail(detail.data);
    setPayments(detail.data.payments);
  };

  const onSubmitDrivers = (drivers) => {
    setDrivers(drivers);
    dialogAction.hide();
  };

  const onDismissDrivers = () => {
    dialogAction.hide();
  };

  const handleDeleteDriver = (data) => {
    console.log(data);
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

  const onSubmitProduct = (product) => {
    setProducts(product);
  };

  const onDismissProduct = () => {
    dialogAction.hide();
  };

  const handleDeleteProduct = (item) => {
    console.log(item);
  };

  const handleEditProduct = (item) => {
    console.log(item);
  };

  const onShowProductDialog = () => {
    dialogAction.show({
      title: "انتخاب کالا",
      component: (
        <Product
          onSubmit={onSubmitProduct}
          onDismiss={onDismissProduct}
          customerId={selectedPerson?.id}
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
                    value={
                      selectedPerson
                        ? `${selectedPerson.firstName} ${selectedPerson.lastName}`
                        : ""
                    }
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
                          value={value}
                          error={!!errors.source}
                          helperText={
                            errors.source ? errors.source.message : ""
                          }
                          fullWidth
                          size="small"
                        />
                      );
                    }}
                    name="source"
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
                          value={value}
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
                    disabled={isEmpty(selectedPerson)}
                    style={{ marginLeft: 10, width: "30%" }}
                    variant="contained"
                    color="primary"
                    onClick={onShowProductDialog}
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
                                    {row.stock}
                                  </TableCell>
                                  <TableCell padding="none">
                                    {row.unit.label}
                                  </TableCell>
                                  <TableCell padding="none">
                                    {row.depot.label}
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
                          value={value}
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
                  ref={paymentRef}
                  defaultValues={payments}
                />

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
