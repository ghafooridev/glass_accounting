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
} from "@material-ui/core";
import TableRowMenu from "../../components/Table/TableRowMenu";
import TableTop from "../../components/Table/TableTop";
import TableHeader from "../../components/Table/TableHead";
import TablePaging from "../../components/Table/TablePaging";
import { useApi } from "../../hooks/useApi";
import { convertParamsToQueryString } from "../../helpers/utils";
import DialogActions from "../../redux/actions/dialogAction";
import styles from "./style";

const headCells = [
  {
    id: "username",
    label: "نام کاربری",
  },
  {
    id: "firstName",
    label: "نام",
  },
  { id: "lastName", label: "نام خانوادگی" },
  {
    id: "mobile",
    label: "موبایل",
  },
  { id: "phone", label: "تلفن" },
  { id: "action" },
];

const MainList = () => {
  const classes = styles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("username");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
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
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  const onAdd = () => {
    history.push("/app/user-detail");
  };

  const getUserRequest = useApi({
    method: "get",
    url: `user?${convertParamsToQueryString({
      page,
      order,
      orderBy,
      pageSize,
    })}`,
  });

  const deleteUseRequest = useApi({
    method: "delete",
    url: `user`,
  });

  const handleAction = (id, type) => {
    const types = {
      edit: () => {
        history.push(`/app/user-detail?id=${id}`);
      },
      delete: () => {
        DialogActions.show({
          confirm: true,
          title: "ایا از حذف این رکورد مطمئن هستید ؟",
          onAction: async () => {
            await deleteUseRequest.execute(null, id);
            setList(list.filter((item) => item.id !== id));
            DialogActions.hide();
          },
          size: "sm",
          disableCloseButton: false,
        });
      },
    };
    if (types[type]) {
      types[type]();
    }
  };

  const getData = async () => {
    const userList = await getUserRequest.execute();
    setList(userList.data);
  };

  useEffect(() => {
    getData();
  }, [page, order, pageSize]);

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
              {list.map((row) => {
                return (
                  <TableRow
                    hover
                    tabIndex={-1}
                    key={row.id}
                    style={{ paddingRight: 10 }}
                  >
                    <TableCell padding="none">{row.username}</TableCell>
                    <TableCell padding="none">{row.firstName}</TableCell>
                    <TableCell padding="none">{row.lastName}</TableCell>
                    <TableCell padding="none">{row.mobile}</TableCell>
                    <TableCell padding="none">{row.phone}</TableCell>

                    <TableCell padding="none">
                      <TableRowMenu
                        options={[
                          { id: "edit", title: "ویرایش" },
                          { id: "delete", title: "حذف" },
                        ]}
                        hadleAction={(type) => handleAction(row.id, type)}
                      />
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
          count={list.length}
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
