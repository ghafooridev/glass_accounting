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
  { id: "cardNumber", label: "شماره کارت" },
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
  const [category, setCategory] = useState([]);
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
    setPageSize(event.target.value);
    setPage(0);
  };

  const onAdd = () => {
    history.push("/app/customer-detail");
  };

  const getCustomerRequest = useApi({
    method: "get",
    url: decodeURIComponent(
      `customer?${convertParamsToQueryString({
        page,
        order,
        orderBy,
        pageSize,
        search,
        filter,
      })}`,
    ),
  });

  const deleteUseRequest = useApi({
    method: "delete",
    url: `customer`,
  });

  const GetCustomerCategoryRequest = useApi({
    method: "get",
    url: "customer/category",
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
        history.push(`/app/person-transaction?id=${row.id}&type=employee`);
      },
    };
    if (types[type]) {
      types[type]();
    }
  };

  const onClicKRow = (e, row) => {
    if (e.target.tagName === "TD") {
      handleAction(row, "edit");
    }
  };

  const onSearch = (value) => {
    setSearch(value);
    setPage(0);
  };

  const onFilter = (data) => {
    const properData = `{name:${data.name},status:${data.status},category:${data.category}}`;
    setFilter(properData);
    setPage(0);
  };

  const getData = async () => {
    const customerList = await getCustomerRequest.execute();
    setList(customerList.data);
    setTotal(customerList.total);
  };

  const getCategory = async () => {
    const categories = await GetCustomerCategoryRequest.execute();
    setCategory(categories.data);
  };

  useEffect(() => {
    getData();
  }, [page, order, search, pageSize, filter]);

  useEffect(() => {
    getCategory();
  }, []);

  return (
    <>
      {hasPermission(Constant.ALL_PERMISSIONS.CUSTOMER_SHOW) && (
        <Slide direction="down" in={true}>
          <div>
            {getCustomerRequest.pending ? (
              <TableSkeleton headCount={headCells} />
            ) : (
              <div className={classes.root}>
                <Paper className={classes.paper}>
                  <TableTop
                    title="لیست مشتریان"
                    onAdd={
                      hasPermission(Constant.ALL_PERMISSIONS.CUSTOMER_EDIT) &&
                      onAdd
                    }
                    FilterComponent={
                      <FilterComponent
                        onFilter={onFilter}
                        category={category}
                      />
                    }
                    // handleSearch={onSearch}
                    defaultSearch={search}
                    addPermission={hasPermission(
                      Constant.ALL_PERMISSIONS.CUSTOMER_EDIT,
                    )}
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
                                {persianNumber(row.accountCardNumber)}
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
                                    {
                                      id: "edit",
                                      title: "ویرایش",
                                      hidden: !hasPermission(
                                        Constant.ALL_PERMISSIONS.CUSTOMER_EDIT,
                                      ),
                                    },
                                    {
                                      id: "delete",
                                      title: "حذف",
                                      hidden: !hasPermission(
                                        Constant.ALL_PERMISSIONS
                                          .CUSTOMER_DELETE,
                                      ),
                                    },
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
