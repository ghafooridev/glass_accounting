import React, { useEffect, useState } from "react";
import { Grid, TextField, MenuItem, Button, Divider } from "@material-ui/core";
import { useApi } from "../../hooks/useApi";

const Filter = ({ onFilter }) => {
  const [filterData, setFilterData] = useState("");
  const [category, setCategory] = useState([]);
  const [driverCategory, setDriverCategory] = useState(1);

  const driverCategoryRequest = useApi({
    method: "get",
    url: `driver/category`,
  });

  const handleChange = (prop) => (event) => {
    setFilterData(event.target.value);
  };

  const getDriverCategory = async () => {
    const detail = await driverCategoryRequest.execute();
    setCategory(detail.data);
  };

  const onChangeCategory = (e) => {
    setDriverCategory(e.target.value);
  };

  const onSubmit = () => {
    if (typeof onFilter === "function") {
      onFilter(`{name:${filterData},category:${driverCategory}}`);
    }
  };

  useEffect(() => {
    getDriverCategory();
  }, []);

  return (
    <Grid container spacing={3} alignItems="center" style={{ padding: 10 }}>
      <Grid item lg={3} xs={12}>
        <TextField
          variant="outlined"
          label="نام"
          onChange={handleChange("name")}
          value={filterData}
          fullWidth
          size="small"
        />
      </Grid>
      <Grid item lg={3} xs={12}>
        {!!category.length && driverCategory && (
          <TextField
            select
            label="دسته بندی"
            value={driverCategory}
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
            <MenuItem key={"ALL"} value={"ALL"}>
              همه دسته بندی ها
            </MenuItem>
          </TextField>
        )}
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
