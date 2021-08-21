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
  TextField,
} from "@material-ui/core";
import clsx from "clsx";
import TableTop from "../../components/Table/TableTop";
import TableHeader from "../../components/Table/TableHead";
import TablePaging from "../../components/Table/TablePaging";
import { useApi } from "../../hooks/useApi";
import { convertParamsToQueryString } from "../../helpers/utils";
import styles from "./style";
import Constant from "../../helpers/constant";

const headCellsCustomer = [
  {
    id: "firstName",
    label: "نام",
  },
  { id: "lastName", label: "نام خانوادگی" },

  { id: "status", label: "وضعیت" },
];
const headCellsPerson = [
  { id: "lastName", label: "نام و نام خانوادگی" },
  { id: "type", label: "نوع شخص" },
];

const PERSON_TYPE = {
  EMPLOYEE: "پرسنل",
  CUSTOMER: "مشتری",
  DRIVER: "راننده",
};

export default function MainList({ onSelect, onDismiss, filter }) {
  const classes = styles();
  const [order, setOrder] = useState("asc");
  const [search, setSearch] = useState();
  const [orderBy, setOrderBy] = useState("firstName");
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

  const getCustomerRequest = useApi({
    method: "get",
    url: `${filter}?${convertParamsToQueryString({
      page,
      order,
      orderBy,
      pageSize,
      search,
    })}`,
  });

  const onChangeSearch = (e) => {
    setSearch(e.target.value);
  };

  const getData = async () => {
    const customerList = await getCustomerRequest.execute();
    setList(customerList.data);
  };

  const onClicKRow = (e, row) => {
    if (e.target.tagName === "TD") {
      onSelect(row);
    }
  };

  useEffect(() => {
    getData();
  }, [page, order, search, pageSize]);

  return (
    <div style={{ marginTop: -20, maxHeight: 300 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          className={classes.title}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          لیست افراد
        </Typography>

        <TextField
          variant="outlined"
          label=" جستجو"
          onChange={onChangeSearch}
          value={search}
          size="small"
        />
      </div>
      <TableContainer>
        <Table className={classes.table} size={"medium"}>
          <TableHeader
            classes={classes}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            rowCount={list.length}
            headCells={
              filter === "person" ? headCellsPerson : headCellsCustomer
            }
          />

          <TableBody>
            {list.map((row) => {
              return (
                <TableRow
                  hover
                  tabIndex={-1}
                  key={filter === "customer" ? row.id : row.value}
                  style={{ paddingRight: 10 }}
                  onClick={(e) => onClicKRow(e, row)}
                >
                  {filter === "person" && (
                    <TableCell padding="none">{row.label}</TableCell>
                  )}
                  {filter === "person" && (
                    <TableCell padding="none">
                      {PERSON_TYPE[row.personType]}
                    </TableCell>
                  )}

                  {filter === "customer" && (
                    <TableCell padding="none">{row.firstName}</TableCell>
                  )}
                  {filter === "customer" && (
                    <TableCell padding="none">{row.lastName}</TableCell>
                  )}

                  {filter === "customer" && (
                    <TableCell padding="none">
                      <Chip
                        label={Constant.PERSON_STATUS[row.status]}
                        className={clsx(classes.status, classes[row.status])}
                      />
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
            {!list.length && !getCustomerRequest.pending && (
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
    </div>
  );
}
