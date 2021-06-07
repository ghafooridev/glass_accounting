import React, { useEffect, useState } from "react";
import { Grid, TextField, Button, MenuItem } from "@material-ui/core";
import { useApi } from "../../hooks/useApi";

export default function MainDetail({ productId, units, onSubmit, onDismiss }) {
  const [selectedUnit, setSelectedUnit] = useState(units[0].value);
  const [selectedSource, setSelectedSource] = useState(5);
  const [selectedDestination, setSelectedDestination] = useState(5);
  const [amount, setAmount] = useState();
  const [description, setDescription] = useState();
  const [depotPicker, setDepotPicker] = useState([]);

  const getDepotRequest = useApi({
    method: "get",
    url: `depot/picker`,
  });

  const onDone = () => {
    onSubmit({
      sourceDepotId: selectedSource,
      destinationDepotId: selectedDestination,
      productId,
      amount,
      unit: selectedUnit,
      description,
    });
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
      },
    };
    if (types[type]) {
      return types[type]();
    }
  };

  const getDepotPicker = async () => {
    const result = await getDepotRequest.execute();
    setDepotPicker(result.data);
  };

  useEffect(() => {
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
