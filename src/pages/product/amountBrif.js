import React from "react";

import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableCell,
  TableRow,
  Button,
} from "@material-ui/core";
import TableHeader from "../../components/Table/TableHead";

const headCells = [
  {
    id: "amount",
    label: "موجودی",
  },
  { id: "unit", label: "واحد" },
  {
    id: "depot",
    label: "انبار",
  },
];

export default function MainDetail({ data, onSubmit }) {
  console.log(data);
  return (
    <Grid container spacing={3} alignItems="center">
      {!!data.length && (
        <Grid item xs={12}>
          <TableContainer style={{ padding: "0 10px" }}>
            <Table size={"medium"} style={{ paddingRight: 10 }}>
              <TableHeader headCells={headCells} />

              <TableBody>
                {data.map((row) => {
                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={row.id}
                      style={{ paddingRight: 10 }}
                    >
                      <TableCell padding="none">{row.stock}</TableCell>
                      <TableCell padding="none">{row.unit}</TableCell>
                      <TableCell padding="none">{row.depot}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      )}
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={onSubmit}>
          بازگشت
        </Button>
      </Grid>
    </Grid>
  );
}
