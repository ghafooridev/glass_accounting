import React, { useState } from "react";
import { Grid, TextField, MenuItem, Button, Divider } from "@material-ui/core";

const Filter = ({ onFilter, category }) => {
  const [filterData, setFilterData] = useState({ category: "" });

  const handleChange = (event) => {
    // setFilterData(event.target.value);
    setFilterData({ ...filterData, category: event.target.value });
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
          select
          label="دسته بندی"
          onChange={handleChange}
          value={filterData.category}
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
