import React, { useEffect, useState } from "react";
import { Grid, TextField, Button, MenuItem } from "@material-ui/core";
import { useApi } from "../../hooks/useApi";

export default function MainDetail({ source, onSubmit, onDismiss }) {
  const [cashes, setCashes] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState(5);
  const [amount, setAmount] = useState();

  const getCashRequest = useApi({
    method: "get",
    url: `cashdesk/picker`,
  });

  const onDone = () => {
    onSubmit({
      sourceId: source,
      destinationId: selectedDestination,
      amount,
    });
  };

  const onChange = (e, type) => {
    if (type === "destination") {
      setSelectedDestination(e.target.value);
    } else {
      setAmount(e.target.value);
    }
  };

  const getCashes = async () => {
    const result = await getCashRequest.execute();
    console.log(source, result.data);
    const filterdCashes = result.data.filter((item) => item.value !== source);
    setCashes(filterdCashes);
  };

  useEffect(() => {
    getCashes();
  }, []);

  return (
    <form>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            select
            label="صندوق مقصد"
            onChange={(e) => onChange(e, "destination")}
            value={selectedDestination}
            variant="outlined"
            fullWidth
            size="small"
            name="cash"
          >
            {cashes.map((option) => (
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
            label="مبلغ"
            name={"amount"}
            onChange={(e) => onChange(e, "amount")}
            value={amount}
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
