import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableContainer,
  TableCell,
  TableRow,
  Paper,
  Typography,
} from "@material-ui/core";

import TableRowMenu from "../../components/Table/TableRowMenu";
import TableTop from "../../components/Table/TableTop";
import TableHeader from "../../components/Table/TableHead";
import TablePaging from "../../components/Table/TablePaging";
import { useApi } from "../../hooks/useApi";
import { convertParamsToQueryString } from "../../helpers/utils";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "id",
    numeric: false,
    disablePadding: true,
    label: "id",
  },
  { id: "email", numeric: true, disablePadding: false, label: "email" },
  {
    id: "first_name",
    numeric: true,
    disablePadding: false,
    label: "first_name",
  },
  { id: "last_name", numeric: true, disablePadding: false, label: "last_name" },
  { id: "action" },
];

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));

export default function UserList() {
  const classes = useStyles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("email");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [list, setList] = useState([]);
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
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const onAdd = () => {
    console.log("x");
    history.push("/app/user-detail");
  };

  const handleAction = (id, type) => {
    console.log("x", id, type);
    const types = {
      edit: () => {
        console.log(id, type);
      },
      delete: () => {
        console.log(id, type);
      },
    };
    if (types[type]) {
      types[type]();
    }
  };

  const userRequest = useApi({
    method: "get",
    url: `/api/users?${convertParamsToQueryString({ page, order, orderBy })}`,
  });

  const getData = async () => {
    const userList = await userRequest.execute();
    setList(userList.data.data);
    console.log(userList);
  };
  console.log(">>>.", list);
  console.log("response", userRequest);
  useEffect(() => {
    getData();
  }, [page, order]);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableTop title="لیست کاربران" onAdd={onAdd} />
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
              {stableSort(list, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={row.id}
                      style={{ paddingRight: 10 }}
                    >
                      <TableCell padding="none">{row.id}</TableCell>
                      <TableCell padding="none">{row.email}</TableCell>
                      <TableCell padding="none">{row.first_name}</TableCell>
                      <TableCell padding="none">{row.last_name}</TableCell>
                      <TableCell padding="none">
                        <TableRowMenu
                          options={[
                            { id: "delete", title: "حذف" },
                            { id: "edit", title: "ویرایش" },
                          ]}
                          hadleAction={(type) => handleAction(row.id, type)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              {!list.length && !userRequest.pending && (
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
          rowsPerPage={rowsPerPage}
        />
      </Paper>
    </div>
  );
}
