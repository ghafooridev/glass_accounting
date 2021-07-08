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
} from "@material-ui/core";
import clsx from "clsx";
import TableRowMenu from "../../components/Table/TableRowMenu";
import TableTop from "../../components/Table/TableTop";
import TableHeader from "../../components/Table/TableHead";
import TablePaging from "../../components/Table/TablePaging";
import { useApi } from "../../hooks/useApi";
import {
  convertParamsToQueryString,
  hasPermission,
  persianNumber,
} from "../../helpers/utils";
import DialogActions from "../../redux/actions/dialogAction";
import styles from "./style";
import FilterComponent from "./filter";
import Constant from "../../helpers/constant";
import { Slide } from "@material-ui/core";
import TableSkeleton from "../../components/Skeleton";

const headCells = [
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
  { id: "remaining", label: "مانده حساب" },
  { id: "status", label: "وضعیت" },
  { id: "action" },
];

export default function MainList() {
  const classes = styles();
  const [order, setOrder] = useState("asc");
  const [search, setSearch] = useState();
  const [orderBy, setOrderBy] = useState("firstName");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(Constant.TABLE_PAGE_SIZE);
  const [list, setList] = useState([]);
  const [filter, setFilter] = useState();
  const history = useHistory();
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
    setPageSize(parseInt(event.target.value, Constant.TABLE_PAGE_SIZE));
    setPage(0);
  };

  const onAdd = () => {
    history.push("/app/customer-detail");
  };

  const getCustomerRequest = useApi({
    method: "get",
    url: `customer?${convertParamsToQueryString({
      page,
      order,
      orderBy,
      pageSize,
      search,
      filter,
    })}`,
  });

  const deleteUseRequest = useApi({
    method: "delete",
    url: `customer`,
  });

  const handleAction = (row, type) => {
    const types = {
      edit: () => {
        history.push(`/app/customer-detail?id=${row.id}`);
      },
      delete: () => {
        DialogActions.show({
          confirm: true,
          title: "ایا از حذف این رکورد مطمئن هستید ؟",
          onAction: async () => {
            await deleteUseRequest.execute(null, row.id);
            setList(list.filter((item) => item.id !== row.id));
            DialogActions.hide({ name: "delete" });
          },
          name: "delete",
          size: "6",
          disableCloseButton: false,
        });
      },
      transaction: () => {
        history.push(`/app/customer-transaction?id=${row.id}`);
      },
    };
    if (types[type]) {
      types[type]();
    }
  };

  const onSearch = (value) => {
    setSearch(value);
    setPage(0);
  };

  const onFilter = (data) => {
    setFilter(data);
    setPage(0);
  };

  const getData = async () => {
    const customerList = await getCustomerRequest.execute();
    setList(customerList.data);
    setTotal(customerList.total);
  };

  useEffect(() => {
    getData();
  }, [page, order, search, pageSize, filter]);

  return (
    <>
      {hasPermission(Constant.ALL_PERMISSIONS.CASH_LIST) && (
        <Slide direction="down" in={true}>
          <div>
            {getCustomerRequest.pending ? (
              <TableSkeleton headCount={headCells} />
            ) : (
              <div className={classes.root}>
                <Paper className={classes.paper}>
                  <TableTop
                    title="لیست مشتریان"
                    onAdd={onAdd}
                    FilterComponent={<FilterComponent onFilter={onFilter} />}
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
                          return (
                            <TableRow
                              hover
                              tabIndex={-1}
                              key={row.id}
                              style={{ paddingRight: 10 }}
                            >
                              <TableCell padding="none">
                                {row.firstName}
                              </TableCell>
                              <TableCell padding="none">
                                {row.lastName}
                              </TableCell>
                              <TableCell padding="none">
                                {persianNumber(row.mobile)}
                              </TableCell>
                              <TableCell padding="none">
                                {persianNumber(row.phone)}
                              </TableCell>
                              <TableCell padding="none">
                                {persianNumber(row.accountRemaining)?.replace(
                                  "-",
                                  "",
                                )}
                              </TableCell>
                              <TableCell padding="none">
                                <Chip
                                  label={Constant.PERSON_STATUS[row.status]}
                                  className={clsx(
                                    classes.status,
                                    classes[row.status],
                                  )}
                                />
                              </TableCell>
                              <TableCell padding="none">
                                <TableRowMenu
                                  options={[
                                    { id: "transaction", title: "تراکنش ها" },
                                    { id: "edit", title: "ویرایش" },
                                    { id: "delete", title: "حذف" },
                                  ]}
                                  hadleAction={(type) =>
                                    handleAction(row, type)
                                  }
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                        {!list.length && !getCustomerRequest.pending && (
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
}
