import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableContainer,
  TableCell,
  TableRow,
  Typography,
  Chip,
  Button,
  Grid,
} from "@material-ui/core";
import clsx from "clsx";
import TableTop from "../../components/Table/TableTop";
import TableHeader from "../../components/Table/TableHead";
import TablePaging from "../../components/Table/TablePaging";
import { useApi } from "../../hooks/useApi";
import { convertParamsToQueryString } from "../../helpers/utils";
import styles from "./style";
import Constant from "../../helpers/constant";

const headCells = [
  {
    id: "name",
    label: "نام صندوق",
  },

  {
    id: "logo",
    label: "بانک",
  },
  { id: "amount", label: "موجودی" },

  { id: "action" },
];

export default function CashSelector({ onSelect, onDismiss, chequeId }) {
  const classes = styles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [search, setSearch] = useState();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(Constant.TABLE_PAGE_SIZE);
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(event.target.value);
    setPage(0);
  };
  const onSearch = (value) => {
    setSearch(value);
  };

  const getCashRequest = useApi({
    method: "get",
    url: `cashdesk?type=BANK&${convertParamsToQueryString({
      page,
      order,
      orderBy,
      pageSize,
      search,
    })}`,
  });

  const handleAction = (id) => {
    onSelect(id, chequeId);
  };

  const onClicKRow = (e, row) => {
    if (e.target.tagName === "TD") {
      handleAction(row.id);
    }
  };

  const getData = async () => {
    const cashList = await getCashRequest.execute();
    setList(cashList.data);
    setTotal(cashList.total);
  };

  useEffect(() => {
    getData();
  }, [page, order, search, pageSize]);

  return (
    <div style={{ marginTop: -50 }}>
      <TableTop
      // handleSearch={onSearch}
      />
      <TableContainer style={{ padding: "0 10px" }}>
        <Table
          className={classes.table}
          size={"medium"}
          style={{ paddingRight: 10 }}
        >
          <TableHeader
            classes={classes}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            rowCount={list.length}
            headCells={headCells}
          />
          <TableBody>
            {list.map((row) => {
              return (
                <TableRow
                  hover
                  tabIndex={-1}
                  key={row.id}
                  style={{ paddingRight: 10 }}
                  onClick={(e) => onClicKRow(e, row)}
                >
                  <TableCell padding="none">{row.name}</TableCell>

                  <TableCell padding="none">
                    {row.bank && (
                      <img
                        style={{ width: 40, height: 40 }}
                        alt={row.bank.name}
                        src={`${Constant.API_ADDRESS}/${row.bank.logo}`}
                      />
                    )}
                  </TableCell>
                  <TableCell padding="none">{row.amount}</TableCell>

                  <TableCell padding="none">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleAction(row.id)}
                    >
                      انتخاب حساب
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {!list.length && !getCashRequest.pending && (
              <TableRow style={{ height: 53 }}>
                <TableCell colSpan={6} style={{ textAlign: "center" }}>
                  <Typography variant="h6">
                    داده ای برای نمایش وجود ندارد
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePaging
        count={total}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        page={page}
        rowsPerPage={pageSize}
      />

      <Grid
        item
        xs={12}
        style={{ display: "flex", justifyContent: "flex-end" }}
      >
        <Button variant="contained" color="secondary" onClick={onDismiss}>
          انصراف
        </Button>
      </Grid>
    </div>
  );
}
