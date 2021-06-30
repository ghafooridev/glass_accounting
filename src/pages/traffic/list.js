import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Table,
  TableBody,
  TableContainer,
  TableCell,
  TableRow,
  Paper,
  Typography,
  Chip,
  Button,
} from "@material-ui/core";
import TableRowMenu from "../../components/Table/TableRowMenu";
import TableTop from "../../components/Table/TableTop";
import TableHeader from "../../components/Table/TableHead";
import TablePaging from "../../components/Table/TablePaging";
import { useApi } from "../../hooks/useApi";
import { convertParamsToQueryString } from "../../helpers/utils";
import DialogActions from "../../redux/actions/dialogAction";
import styles from "./style";
import Constant from "../../helpers/constant";
import clsx from "clsx";
import Description from "./description";
const headCells = [
  {
    id: "firstName",
    label: "نام",
  },
  { id: "lastName", label: "نام خانوادگی" },
  {
    id: "log",
    label: "میزان کارکرد",
  },
  {
    id: "price",
    label: "مبلغ حساب",
  },
  { id: "status", label: "وضعیت" },
  { id: "action" },
];

const MainList = () => {
  const classes = styles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("username");
  const [search, setSearch] = useState();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(Constant.TABLE_PAGE_SIZE);
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [selectedEmployee, setSelectedEmployee] = useState();
  const history = useHistory();

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

  const onSearch = (value) => {
    setSearch(value);
    setPage(0);
  };

  const getUserRequest = useApi({
    method: "get",
    url: `user?${convertParamsToQueryString({
      page,
      order,
      orderBy,
      pageSize,
      search,
    })}`,
  });

  const handelDescription = (id, type) => {
    DialogActions.show({
      confirm: false,
      title: `${selectedEmployee}جزییات کارکرد`,
      component: <Description employee={selectedEmployee} />,
      size: "lg",
      disableCloseButton: false,
    });
  };

  const getData = async () => {
    const userList = await getUserRequest.execute();
    setList(userList.data);
    setTotal(userList.total);
  };

  useEffect(() => {
    getData();
  }, [page, order, search, pageSize]);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableTop title=" گزارش تردد پرسنل" handleSearch={onSearch} />
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
                  >
                    <TableCell padding="none">{row.firstName}</TableCell>
                    <TableCell padding="none">{row.lastName}</TableCell>
                    <TableCell padding="none">{row.totalLog}</TableCell>
                    <TableCell padding="none">{row.totalPrice}</TableCell>
                    <TableCell padding="none">
                      <Chip
                        label={Constant.PERSON_STATUS[row.status]}
                        className={clsx(classes.status, classes[row.status])}
                      />
                    </TableCell>
                    <TableCell padding="none">
                      <Button variant="outlined"> نمایش جزییات</Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {!list.length && !getUserRequest.pending && (
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
      </Paper>
    </div>
  );
};

export default MainList;
