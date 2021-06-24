import React, { useEffect, useState } from "react";

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
import { useApi } from "../../hooks/useApi";
import { persianNumber } from "../../helpers/utils";

const headCells = [
  {
    id: "name",
    label: "نام کالا",
  },
  { id: "amounts", label: "موجودی ها" },
];

export default function MainDetail({ depotId, onSubmit }) {
  const [data, setData] = useState([]);
  const getAmountRequest = useApi({
    method: "get",
    url: `product/depot/${depotId}`,
  });
  const getAmount = async () => {
    const result = await getAmountRequest.execute();
    setData(result.data);
  };
  useEffect(() => {
    getAmount();
  }, []);
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
                      <TableCell padding="none">{row.name}</TableCell>
                      <TableCell padding="none">
                        <ul>
                          {row.stocks.map((item) => {
                            return (
                              <li>
                                <span style={{ margin: "0 -5px 0 5px" }}>
                                  {persianNumber(item.stock)}
                                </span>

                                <span>{item.unit}</span>
                              </li>
                            );
                          })}
                        </ul>
                      </TableCell>
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
