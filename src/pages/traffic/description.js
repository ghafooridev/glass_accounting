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
    id: "date",
    label: " تاریخ",
  },
  {
    id: "firstEnter",
    label: "ورود اول",
  },
  { id: "secondEnter", label: "خروج اول" },
  {
    id: "secondEnter",
    label: "ورود دوم",
  },
  {
    id: "secondExit",
    label: "خروج دوم",
  },
  {
    id: "total",
    label: " کارکرد روز",
  },
];

export default function MainList({ onDismiss }) {
  const classes = styles();
  const [order, setOrder] = useState("asc");
  const [search, setSearch] = useState();
  const [orderBy, setOrderBy] = useState("date");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(Constant.TABLE_PAGE_SIZE);
  const [list, setList] = useState([]);

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

  const getEmployeeLogRequest = useApi({
    method: "get",
    url: `employee?${convertParamsToQueryString({
      page,
      order,
      orderBy,
      pageSize,
      search,
    })}`,
  });

  const onSearch = (value) => {
    setSearch(value);
  };

  const getData = async () => {
    const logList = await getEmployeeLogRequest.execute();
    setList(logList.data);
  };

  useEffect(() => {
    getData();
  }, [page, order, search, pageSize]);

  return (
    <div style={{ marginTop: -50 }}>
      <TableTop
      // handleSearch={onSearch}
      />
      <TableContainer>
        <Table className={classes.table} size={"medium"}>
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
                >
                  <TableCell padding="none">{row.date}</TableCell>
                  <TableCell padding="none">{row.firstEnter}</TableCell>
                  <TableCell padding="none">{row.firstExit}</TableCell>
                  <TableCell padding="none">{row.secondEnter}</TableCell>
                  <TableCell padding="none">{row.secondExit}</TableCell>
                  <TableCell padding="none">{row.total}</TableCell>
                </TableRow>
              );
            })}
            {!list.length && !getEmployeeLogRequest.pending && (
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
        count={list.length}
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
          بازگشت
        </Button>
      </Grid>
    </div>
  );
}
