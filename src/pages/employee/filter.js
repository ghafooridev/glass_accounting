import React, { useState } from "react";
import { Grid, TextField, MenuItem, Button, Divider } from "@material-ui/core";
import Constant from "../../helpers/constant";

const personType = [
  {
    label: "بدهکار",
    value: Constant.PERSON_STATUS.DEBTIOR,
  },
  { label: "بی حساب", value: Constant.PERSON_STATUS.NODEBT },
  { label: "طلبکار", value: Constant.PERSON_STATUS.CREDITOR },
];

const Filter = ({ onFilter }) => {
  const [filterData, setFilterData] = useState({ name: "", status: "" });

  const handleChange = (prop) => (event) => {
    setFilterData({ ...filterData, [prop]: event.target.value });
  };

  const onSubmit = () => {
    if (typeof onFilter === "function") {
      onFilter(filterData);
    }
  };

  return (
    <Grid container spacing={3} alignItems="center" style={{ padding: 10 }}>
      <Grid item lg={3} xs={12}>
        <TextField
          variant="outlined"
          label="نام"
          onChange={handleChange("name")}
          value={filterData.name}
          fullWidth
          size="small"
        />
      </Grid>
      <Grid item lg={3} xs={12}>
        <TextField
          select
          label="وضعیت"
          onChange={handleChange("status")}
          value={filterData.status}
          variant="outlined"
          fullWidth
          size="small"
        >
          {personType.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
          <MenuItem key={"ALL"} value={"ALL"}>
            همه وضعیت ها
          </MenuItem>
        </TextField>
      </Grid>
      <Grid item lg={3} xs={12}>
        <Button variant="contained" color="primary" onClick={onSubmit}>
          تایید
        </Button>
      </Grid>
      <Divider style={{ width: "100%" }} />
    </Grid>
  );
};
export default Filter;
