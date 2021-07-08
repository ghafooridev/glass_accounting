import React, { useEffect, useState, useRef } from "react";
import {
  Grid,
  TextField,
  Button,
  MenuItem,
  IconButton,
  Collapse,
  Typography,
  Paper,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import Autocomplete from "@material-ui/lab/Autocomplete";
import PrePayment from "../payment/prePayment";
import unitAction from "../../redux/actions/unitAction";
import { getQueryString, persianNumber } from "../../helpers/utils";

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
  deleteIcon: {
    color: theme.palette.error.main,
  },
  formControl: {
    width: "100%",
  },
}));

export default function MainDetail() {
  const productId = getQueryString("id");
  const productName = getQueryString("productName");
  const unitBaseId = getQueryString("unitBaseId");
  const paymentRef = useRef(null);
  const history = useHistory();
  const classes = useStyles();
  const [units, setUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(units[0]?.value);
  const [selectedSource, setSelectedSource] = useState(5);
  const [selectedDestination, setSelectedDestination] = useState(5);
  const [amount, setAmount] = useState();
  const [selectedDriver, setSelectedDriver] = useState();
  const [description, setDescription] = useState();
  const [depotPicker, setDepotPicker] = useState([]);
  const [driverPicker, setDriverPicker] = useState([]);
  const [isAddDriver, setIsAddDriver] = useState(false);
  const [category, setCategory] = useState([]);
  const [categoryId, setDriverCategory] = useState(1);
  const [newDriver, setNewDriver] = useState();
  const [showPerUnit, setShowPerUnit] = useState(false);
  const [perUnit, setPerUnit] = useState();
  const [payments, setPayments] = useState({
    cashes: [],
    banks: [],
    cheques: [],
  });

  const getDepotRequest = useApi({
    method: "get",
    url: `depot/picker`,
  });

  const getDriversRequest = useApi({
    method: "get",
    url: "driver",
  });

  const categoryIdRequest = useApi({
    method: "get",
    url: `driver/category`,
  });

  const transferRequest = useApi({
    method: "post",
    url: `depot/transfer`,
  });

  const addDriverRequest = useApi({
    method: "post",
    url: `driver`,
  });

  const addTransferPaymentRequest = useApi({
    method: "post",
    url: `payment`,
  });

  const getDriverCategory = async () => {
    const detail = await categoryIdRequest.execute();
    setCategory(detail.data);
  };

  const onSubmitTransfer = async () => {
    const data = {
      sourceDepotId: selectedSource,
      destinationDepotId: selectedDestination,
      productId,
      amount,
      perUnit,
      unit: selectedUnit,
      description,
      isAddDriver,
      newDriver,
    };
    let newAddedDriver;
    if (!selectedDriver) {
      newAddedDriver = await addDriverRequest.execute(data.newDriver);
      data.driverId = newAddedDriver.id;
      await transferRequest.execute(data);
    } else {
      data.driverId = selectedDriver.id;
      await transferRequest.execute(data);
    }

    const transferPayments = {
      ...paymentRef.current,
      date: new Date(),
      personId: selectedDriver ? selectedDriver.id : newAddedDriver.id,
      personType: "DRIVER",
      type: "OUTCOME",
      description: `بابت انتقال بین انبارها`,
    };
    await addTransferPaymentRequest.execute(transferPayments);
    setTimeout(() => {
      onDismiss();
    }, 1000);
  };

  const getDrivers = async () => {
    const customerList = await getDriversRequest.execute();
    setDriverPicker(customerList.data);
  };

  const onChange = (e, type) => {
    const types = {
      source: () => {
        setSelectedSource(e.target.value);
      },
      destination: () => {
        setSelectedDestination(e.target.value);
      },
      amount: () => {
        setAmount(e.target.value);
      },
      description: () => {
        setDescription(e.target.value);
      },
      unit: () => {
        setSelectedUnit(e.target.value);
        const targetUnit = units.filter(
          (item) => item.value === e.target.value,
        )[0];
        setShowPerUnit(targetUnit.perUnit);
      },
      firstName: () => {
        setNewDriver({ ...newDriver, firstName: e.target.value });
      },
      lastName: () => {
        setNewDriver({ ...newDriver, lastName: e.target.value });
      },
      carName: () => {
        setNewDriver({ ...newDriver, carName: e.target.value });
      },
      carPlaque: () => {
        setNewDriver({ ...newDriver, carPlaque: e.target.value });
      },
      categoryId: () => {
        setNewDriver({ ...newDriver, categoryId: e.target.value });
      },
      perUnit: () => {
        setPerUnit(e.target.value);
      },
    };
    if (types[type]) {
      return types[type]();
    }
  };

  const onDismiss = () => {
    history.push("/app/product-list");
  };

  const onChangeDriver = (e, value) => {
    setSelectedDriver(value);
  };

  const getDepotPicker = async () => {
    const result = await getDepotRequest.execute();
    setDepotPicker(result.data);
  };

  const onAddDriver = () => {
    setIsAddDriver(!isAddDriver);
  };

  const getUnits = () => {
    const allUnits = unitAction
      .getProductUnit()
      .filter((item) => item.value === unitBaseId)[0];
    if (allUnits) {
      setUnits(allUnits.children);
    }
  };

  useEffect(() => {
    getUnits();
    getDriverCategory();
    getDrivers();
    getDepotPicker();
  }, []);

  return (
    <form>
      <Grid item lg={6} sm={12} className={classes.root}>
        <Paper className={classes.paper}>
          <Typography
            className={classes.title}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            {`انتقال ${productName} بین انبار ها`}
          </Typography>
          <Grid container spacing={3}>
            <Grid item sm={6} xs={12}>
              <TextField
                select
                label="انبار مبدا"
                value={selectedSource}
                onChange={(e) => onChange(e, "source")}
                variant="outlined"
                name="depot"
                fullWidth
                size="small"
              >
                {depotPicker.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item sm={6} xs={12}>
              <TextField
                select
                label="انبار مقصد"
                value={selectedDestination}
                onChange={(e) => onChange(e, "destination")}
                variant="outlined"
                name="depot"
                fullWidth
                size="small"
              >
                {depotPicker.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item sm={6} xs={12}>
              <TextField
                select
                label="واحد"
                value={selectedUnit}
                onChange={(e) => onChange(e, "unit")}
                variant="outlined"
                name="unit"
                fullWidth
                size="small"
              >
                {units.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item sm={6} xs={12}>
              <TextField
                type="number"
                variant="outlined"
                label="مقدار"
                name={"amount"}
                onChange={(e) => onChange(e, "amount")}
                value={amount}
                fullWidth
                size="small"
              />
            </Grid>
            {showPerUnit && (
              <Grid item sm={6} xs={12}>
                <TextField
                  variant="outlined"
                  label="مقدار در واحد"
                  name={"perUnit"}
                  onChange={(e) => onChange(e, "perUnit")}
                  value={perUnit}
                  fullWidth
                  size="small"
                  type="number"
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                multiline
                variant="outlined"
                label="توضیحات"
                name={"description"}
                onChange={(e) => onChange(e, "description")}
                value={description}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid
              item
              sm={6}
              xs={12}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Autocomplete
                id="combo-box-demo"
                onChange={onChangeDriver}
                options={driverPicker}
                getOptionLabel={(option) =>
                  `${option.firstName} ${option.lastName}`
                }
                fullWidth
                size="small"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="انتخاب راننده"
                    variant="outlined"
                  />
                )}
              />
              <IconButton
                color="primary"
                style={{ marginRight: 10 }}
                onClick={onAddDriver}
              >
                <i className="material-icons-round">
                  {isAddDriver ? "clear" : "add"}
                </i>
              </IconButton>
            </Grid>
          </Grid>
          <Collapse in={isAddDriver}>
            <Grid container spacing={3}>
              <Grid item sm={6} xs={12}>
                <TextField
                  variant="outlined"
                  label="نام راننده"
                  onChange={(e) => onChange(e, "firstName")}
                  value={newDriver?.firstName}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  variant="outlined"
                  label="نام خانوادگی راننده"
                  onChange={(e) => onChange(e, "lastName")}
                  value={newDriver?.lastName}
                  fullWidth
                  size="small"
                />
              </Grid>

              <Grid item sm={6} xs={12}>
                <TextField
                  variant="outlined"
                  label="نام ماشین"
                  onChange={(e) => onChange(e, "carName")}
                  value={newDriver?.carName}
                  fullWidth
                  size="small"
                />
              </Grid>

              <Grid item sm={6} xs={12}>
                <TextField
                  variant="outlined"
                  label="پلاک"
                  onChange={(e) => onChange(e, "carPlaque")}
                  value={newDriver?.carPlaque}
                  fullWidth
                  size="small"
                />
              </Grid>

              <Grid item sm={6} xs={12}>
                {!!category.length && categoryId && (
                  <TextField
                    select
                    label="دسته بندی"
                    value={categoryId}
                    onChange={(e) => onChange(e, "categoryId")}
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

              <PrePayment
                type={"OUTCOME"}
                defaultValues={payments}
                ref={paymentRef}
              />
            </Grid>
          </Collapse>

          <Grid
            item
            xs={12}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 30,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={onSubmitTransfer}
            >
              تایید
            </Button>
            <Button variant="contained" color="secondary" onClick={onDismiss}>
              بازگشت
            </Button>
          </Grid>
        </Paper>
      </Grid>
    </form>
  );
}
