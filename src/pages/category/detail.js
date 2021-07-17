import React, { useState } from "react";
import { TextField, Button, Grid } from "@material-ui/core";

const MainDetail = ({ onSubmit, onDismiss, defaultValue }) => {
  const [label, setLabel] = useState(defaultValue.label);

  const onChangeSelectedCategory = (e) => {
    const { value } = e.target;
    setLabel(value);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          style={{ width: "100%" }}
          value={label}
          size="small"
          label="عنوان"
          variant="outlined"
          onChange={onChangeSelectedCategory}
        />
      </Grid>
      <Grid
        item
        xs={12}
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => onSubmit({ value: defaultValue.value, name: label })}
        >
          تایید
        </Button>
        <Button variant="contained" color="secondary" onClick={onDismiss}>
          انصراف
        </Button>
      </Grid>
    </Grid>
  );
};

export default MainDetail;
