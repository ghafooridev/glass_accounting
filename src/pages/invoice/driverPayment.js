import React, { useEffect, useState, useRef } from "react";
import {
  Table,
  TableBody,
  TableContainer,
  TableCell,
  TableRow,
  Typography,
  Button,
  Grid,
  TextField,
  MenuItem,
  Divider,
} from "@material-ui/core";

import PrePayment from "../payment/prePayment";

export default function ProductList({ onDismiss, onSubmit, driverId }) {
  const paymentRef = useRef(null);
  const [payments, setPayments] = useState({
    cashes: [],
    banks: [],
    cheques: [],
  });

  const onDone = () => {
    onSubmit({ ...paymentRef.current }, driverId);
  };

  return (
    <div style={{ marginTop: -20, maxHeight: 300 }}>
      <form>
        <Grid container spacing={3}>
          <PrePayment
            defaultValues={payments}
            type={"OUTCOME"}
            ref={paymentRef}
          />
        </Grid>
      </form>

      <Grid
        item
        xs={12}
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 20,
        }}
      >
        <Button variant="contained" color="primary" onClick={onDone}>
          تایید
        </Button>
        <Button variant="contained" color="secondary" onClick={onDismiss}>
          انصراف
        </Button>
      </Grid>
    </div>
  );
}
