import React, { useState } from "react";
import { Grid, Button, FormControlLabel, Checkbox } from "@material-ui/core";

import Constant from "../../helpers/constant";

export default function Permission({ onSubmit }) {
  const permissions = Constant.PERMISSIONS;
  const [userAccess, setUserAccess] = useState(["USER_SHOW"]);

  const handleChange = (item) => {
    if (userAccess.includes(item)) {
      return setUserAccess(userAccess.filter((i) => i !== item));
    }
    setUserAccess([...userAccess, item]);
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
      </Grid>
    </Grid>
  );
}
