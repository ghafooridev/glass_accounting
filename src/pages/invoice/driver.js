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
import { Reorder } from "@material-ui/icons";

const headCells = [
  {
    id: "firstName",
    label: "نام",
  },
  { id: "lastName", label: "نام خانوادگی" },
  {
    id: "category",
    label: "دسته بندی",
  },
  { id: "mobile", label: "موبایل" },
  { id: "carName", label: "ماشین" },

  { id: "action" },
];

export default function MainList({ onSelect, onDismiss }) {
  const classes = styles();
  const [order, setOrder] = useState("asc");
  const [search, setSearch] = useState();
  const [orderBy, setOrderBy] = useState("firstName");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(Constant.TABLE_PAGE_SIZE);
  const [list, setList] = useState([]);
  const [selectedDrivers, setSelectedDrivers] = useState([]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, Constant.TABLE_PAGE_SIZE));
    setPage(0);
  };

  const getDriverRequest = useApi({
    method: "get",
    url: `driver?${convertParamsToQueryString({
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

  const onSelectDriver = (item) => {
    setSelectedDrivers([...selectedDrivers, item]);
  };

  const onDeselectDriver = (data) => {
    setSelectedDrivers(selectedDrivers.filter((item) => item.id !== data.id));
  };

  const onSubmit = () => {
    onSelect(selectedDrivers);
  };

  const getData = async () => {
    const driverList = await getDriverRequest.execute();
    setList(driverList.data);
  };

  const onClicKRow = (e, row) => {
    if (e.target.tagName === "TD") {
      const index = selectedDrivers.findIndex((item) => item.id === row.id);
      if (index >= 0) {
        onDeselectDriver(row);
      } else {
        onSelectDriver(row);
      }
    }
  };

  useEffect(() => {
    getData();
  }, [page, order, search, pageSize]);

  return (
    <div style={{ marginTop: -20, maxHeight: 300 }}>
      <TableTop handleSearch={onSearch} />
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
                  onClick={(e) => onClicKRow(e, row)}
                >
                  <TableCell padding="none">{row.firstName}</TableCell>
                  <TableCell padding="none">{row.lastName}</TableCell>
                  <TableCell padding="none">{row.category.name}</TableCell>
                  <TableCell padding="none">{row.mobile}</TableCell>
                  <TableCell padding="none">{row.carName}</TableCell>
                  <TableCell padding="none">
                    {selectedDrivers.includes(row) ? (
                      <Button
                        disabled
                        variant="contained"
                        className={classes.selectedButton}
                        endIcon={<i className="material-icons-round">done</i>}
                      >
                        انتخاب شده
                      </Button>
                    ) : (
                      <div></div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            {!list.length && !getDriverRequest.pending && (
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
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <Button variant="contained" color="primary" onClick={onSubmit}>
          تایید
        </Button>
        <Button variant="contained" color="secondary" onClick={onDismiss}>
          بازگشت
        </Button>
      </Grid>
    </div>
  );
}
