import React, { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  Button,
  MenuItem,
  IconButton,
  Collapse,
} from "@material-ui/core";
import { useApi } from "../../hooks/useApi";
import Autocomplete from "@material-ui/lab/Autocomplete";

export default function MainDetail({ productId, units, onSubmit, onDismiss }) {
  const [selectedUnit, setSelectedUnit] = useState(units[0].value);
  const [selectedSource, setSelectedSource] = useState(5);
  const [selectedDestination, setSelectedDestination] = useState(5);
  const [amount, setAmount] = useState();
  const [description, setDescription] = useState();
  const [depotPicker, setDepotPicker] = useState([]);
  const [driverPicker, setDriverPicker] = useState([]);
  const [isAddDriver, setIsAddDriver] = useState(false);
  const [category, setCategory] = useState([]);
  const [categoryId, setDriverCategory] = useState(1);
  const [newDriver, setNewDriver] = useState();
  const [showPerUnit, setShowPerUnit] = useState(false);
  const [perUnit, setPerUnit] = useState();

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

  const getDriverCategory = async () => {
    const detail = await categoryIdRequest.execute();
    setCategory(detail.data);
  };

  const onDone = () => {
    onSubmit({
      sourceDepotId: selectedSource,
      destinationDepotId: selectedDestination,
      productId,
      amount,
      perUnit,
      unit: selectedUnit,
      description,
      isAddDriver,
      newDriver,
    });
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
        console.log(units, e.target.value);
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

  const onChangeDriver = (e, value) => {
    setDriverPicker(value);
  };

  const getDepotPicker = async () => {
    const result = await getDepotRequest.execute();
    setDepotPicker(result.data);
  };

  const onAddDriver = () => {
    setIsAddDriver(!isAddDriver);
  };

  useEffect(() => {
    getDriverCategory();
    getDrivers();
    getDepotPicker();
  }, []);

  return (
    <form>
      <Grid container spacing={3}>
        <Grid item xs={12}>
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
        <Grid item xs={12}>
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

        <Grid item xs={12}>
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

        <Grid item xs={12}>
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
          <Grid item xs={12}>
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
        <Grid item xs={12} style={{ display: "flex", alignItems: "center" }}>
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
              <TextField {...params} label="انتخاب راننده" variant="outlined" />
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

        <Collapse in={isAddDriver}>
          <Grid container spacing={3}>
            <Grid item xs={12} style={{ margin: "0 10px" }}>
              <TextField
                variant="outlined"
                label="نام راننده"
                onChange={(e) => onChange(e, "firstName")}
                value={newDriver?.firstName}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12} style={{ margin: "0 10px" }}>
              <TextField
                variant="outlined"
                label="نام خانوادگی راننده"
                onChange={(e) => onChange(e, "lastName")}
                value={newDriver?.lastName}
                fullWidth
                size="small"
              />
            </Grid>

            <Grid item xs={12} style={{ margin: "0 10px" }}>
              <TextField
                variant="outlined"
                label="نام ماشین"
                onChange={(e) => onChange(e, "carName")}
                value={newDriver?.carName}
                fullWidth
                size="small"
              />
            </Grid>

            <Grid item xs={12} style={{ margin: "0 10px" }}>
              <TextField
                variant="outlined"
                label="پلاک"
                onChange={(e) => onChange(e, "carPlaque")}
                value={newDriver?.carPlaque}
                fullWidth
                size="small"
              />
            </Grid>

            <Grid item xs={12} style={{ margin: "0 10px" }}>
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
          </Grid>
        </Collapse>

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
      </Grid>
    </form>
  );
}
