import React from "react";

import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableCell,
  TableRow,
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

  { id: "action" },
];

export default function MainDetail({ data, onSubmit }) {
  return (
    <Grid container spacing={3} alignItems="center">
      {!!data.length && (
        <Grid item xs={12}>
          <Paper>
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
                        <TableCell padding="none">{row.unit.label}</TableCell>
                        <TableCell padding="none">{row.depot.label}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      )}
    </Grid>
  );
}
