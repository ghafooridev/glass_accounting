import React, { useState } from "react";
import { Grid, Button, FormControlLabel, Checkbox } from "@material-ui/core";

import Constant from "../../helpers/constant";

export default function Permission({ onSubmit, defaultPermissions }) {
  const permissions = Constant.PERMISSIONS;
  const [userAccess, setUserAccess] = useState(defaultPermissions || []);

  const handleChange = (item) => {
    if (userAccess.includes(item)) {
      return setUserAccess(userAccess.filter((i) => i !== item));
    }
    setUserAccess([...userAccess, item]);
  };

  const onSelectAll = () => {
    const array = [];
    permissions.map((item) => {
      array.push(item.value);
    });
    setUserAccess(array);
  };

  const onDeSelectAll = () => {
    setUserAccess([]);
  };

  return (
    <Grid item sm={12}>
      <Grid
        container
        spacing={3}
        style={{
          maxHeight: 200,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          flexWrap: "wrap",
          marginBottom: 20,
        }}
      >
        {permissions.map((item) => {
          return (
            <FormControlLabel
              control={
                <Checkbox
                  checked={userAccess.includes(item.value)}
                  onChange={() => handleChange(item.value)}
                  name={item.value}
                  color="primary"
                />
              }
              label={item.label}
            />
          );
        })}
      </Grid>
      <Grid
        item
        xs={12}
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <Button
          variant="contained"
          color="primary"
          type="submit"
          onClick={() => onSubmit(userAccess)}
        >
          تایید
        </Button>
        <Grid>
          <Button
            variant="contained"
            color="secondary"
            onClick={onSelectAll}
            style={{ margin: "0 10px" }}
          >
            انتخاب همه
          </Button>
          <Button variant="contained" color="secondary" onClick={onDeSelectAll}>
            حذف همه
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}
