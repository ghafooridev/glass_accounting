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
import { convertParamsToQueryString, hasPermission } from "../../helpers/utils";
import DialogActions from "../../redux/actions/dialogAction";
import styles from "./style";
import Constant from "../../helpers/constant";
import { Slide } from "@material-ui/core";
import TableSkeleton from "../../components/Skeleton";

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
  const [search, setSearch] = useState();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(Constant.TABLE_PAGE_SIZE);
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
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

  const onAdd = () => {
    history.push("/app/user-detail?action=add");
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

  const deleteUseRequest = useApi({
    method: "delete",
    url: `user`,
  });

  const handleAction = (id, type) => {
    const types = {
      edit: () => {
        history.push(`/app/user-detail?action=edit&id=${id}`);
      },
      delete: () => {
        DialogActions.show({
          confirm: true,
          title: "ایا از حذف این رکورد مطمئن هستید ؟",
          onAction: async () => {
            await deleteUseRequest.execute(null, id);
            setList(list.filter((item) => item.id !== id));
            DialogActions.hide({ name: "delete" });
          },
          name: "delete",
          size: "6",
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
    setTotal(userList.total);
  };

  useEffect(() => {
    getData();
  }, [page, order, search, pageSize]);

  return (
    <>
      {hasPermission(Constant.ALL_PERMISSIONS.USER_SHOW) && (
        <Slide direction="down" in={true}>
          <div>
            {getUserRequest.pending ? (
              <TableSkeleton headCount={headCells} />
            ) : (
              <div className={classes.root}>
                <Paper className={classes.paper}>
                  <TableTop
                    title="لیست کاربران"
                    onAdd={
                      hasPermission(Constant.ALL_PERMISSIONS.USER_EDIT) && onAdd
                    }
                    handleSearch={onSearch}
                    defaultSearch={search}
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
                          if (!row.isAdmin) {
                            return (
                              <TableRow
                                hover
                                tabIndex={-1}
                                key={row.id}
                                style={{ paddingRight: 10 }}
                              >
                                <TableCell padding="none">
                                  {row.username}
                                </TableCell>
                                <TableCell padding="none">
                                  {row.firstName}
                                </TableCell>
                                <TableCell padding="none">
                                  {row.lastName}
                                </TableCell>
                                <TableCell padding="none">
                                  {row.mobile}
                                </TableCell>
                                <TableCell padding="none">
                                  {row.phone}
                                </TableCell>

                                <TableCell padding="none">
                                  <TableRowMenu
                                    options={[
                                      {
                                        id: "edit",
                                        title: "ویرایش",
                                        hidden: !hasPermission(
                                          Constant.ALL_PERMISSIONS.USER_EDIT,
                                        ),
                                      },
                                      {
                                        id: "delete",
                                        title: "حذف",
                                        hidden: !hasPermission(
                                          Constant.ALL_PERMISSIONS.USER_DELETE,
                                        ),
                                      },
                                    ]}
                                    hadleAction={(type) =>
                                      handleAction(row.id, type)
                                    }
                                  />
                                </TableCell>
                              </TableRow>
                            );
                          }
                        })}
                        {!list.length && !getUserRequest.pending && (
                          <TableRow style={{ height: 53 }}>
                            <TableCell
                              colSpan={6}
                              style={{ textAlign: "center" }}
                            >
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
            )}
          </div>
        </Slide>
      )}
    </>
  );
};
export default MainList;
