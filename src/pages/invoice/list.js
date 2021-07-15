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
  Tabs,
  Tab,
  Chip,
} from "@material-ui/core";
import TableRowMenu from "../../components/Table/TableRowMenu";
import TableTop from "../../components/Table/TableTop";
import TableHeader from "../../components/Table/TableHead";
import TablePaging from "../../components/Table/TablePaging";
import { useApi } from "../../hooks/useApi";
import {
  convertParamsToQueryString,
  persianNumber,
  hasPermission,
} from "../../helpers/utils";
import DialogActions from "../../redux/actions/dialogAction";
import styles from "./style";
import Constant from "../../helpers/constant";
import clsx from "clsx";
import { getQueryString } from "../../helpers/utils";
import { Slide } from "@material-ui/core";
import TableSkeleton from "../../components/Skeleton";
import FilterComponent from "./filter";

const headCells = [
  { id: "id", label: "شماره فاکتور" },
  {
    id: "person",
    label: "مشتری",
  },
  {
    id: "date",
    label: "تاریخ",
  },
  { id: "price", label: "مبلغ" },
  {
    id: "category",
    label: "دسته بندی",
  },
  {
    id: "type",
    label: "نوع",
  },

  // { id: "action" },
];

const MainList = () => {
  const invoiceType = getQueryString("type");
  const classes = styles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("date");
  const [search, setSearch] = useState();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(Constant.TABLE_PAGE_SIZE);
  const [list, setList] = useState([]);
  const [filter, setFilter] = useState();
  const [total, setTotal] = useState(0);
  const [type, setType] = useState(invoiceType);
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
    history.push(`/app/invoice-detail?type=${type}`);
  };

  const onSearch = (value) => {
    setSearch(value);
    setPage(0);
  };

  const getInvoiceRequest = useApi({
    method: "get",
    url: decodeURIComponent(
      `invoice?${convertParamsToQueryString({
        page,
        order,
        orderBy,
        pageSize,
        search,
        type,
        filter,
      })}`,
    ),
  });

  const deleteUseRequest = useApi({
    method: "delete",
    url: `invoice`,
  });

  const handleAction = (id, type) => {
    const types = {
      edit: () => {
        history.push(`/app/invoice-detail?type=${type}&id=${id}`);
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

  const onChangeType = (e, value) => {
    setType(value);
  };

  const getTableTitle = () => {
    if (type === "SELL") {
      return "لیست فاکتورهای فروش ";
    } else if (type === "BUY") {
      return "لیست فاکتورهای خرید";
    }
    return "لیست تمامی فاکتور ها";
  };

  const getData = async () => {
    const invoiceList = await getInvoiceRequest.execute();
    setList(invoiceList.data);
    setTotal(invoiceList.total);
  };

  const onFilter = (data) => {
    setFilter(data);
    setPage(0);
  };

  useEffect(() => {
    getData();
  }, [page, order, search, pageSize, type, filter]);

  useEffect(() => {
    setType(invoiceType);
  }, [invoiceType]);

  return (
    <>
      {hasPermission(Constant.ALL_PERMISSIONS.CASH_LIST) && (
        <Slide direction="down" in={true}>
          <div>
            {getInvoiceRequest.pending ? (
              <TableSkeleton headCount={headCells} />
            ) : (
              <div className={classes.root}>
                <Paper className={classes.paper}>
                  <TableTop
                    title={getTableTitle()}
                    onAdd={type !== "ALL" && onAdd}
                    handleSearch={onSearch}
                    defaultSearch={search}
                    FilterComponent={<FilterComponent onFilter={onFilter} />}
                  />
                  <div className={classes.tab}>
                    <Tabs
                      variant="fullWidth"
                      value={type}
                      onChange={onChangeType}
                      indicatorColor="primary"
                      textColor="primary"
                      centered
                    >
                      <Tab
                        icon={
                          <i
                            className={clsx(
                              "material-icons-round",
                              classes.allIcon,
                            )}
                          >
                            sync
                          </i>
                        }
                        label="کل تراکنش ها"
                        value="ALL"
                      />
                      <Tab
                        icon={
                          <i
                            className={clsx(
                              "material-icons-round",
                              classes.incomeIcon,
                            )}
                          >
                            sell
                          </i>
                        }
                        label="فاکتور های فروش"
                        value="SELL"
                      />
                      <Tab
                        icon={
                          <i
                            className={clsx(
                              "material-icons-round",
                              classes.outgoIcon,
                            )}
                          >
                            shopping_basket
                          </i>
                        }
                        label="فاکتور های خرید"
                        value="BUY"
                      />
                    </Tabs>
                  </div>
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
                                {persianNumber(row.id)}
                              </TableCell>
                              <TableCell padding="none">
                                {row.globalCustomer
                                  ? `${row.globalCustomer}(${row.customer})`
                                  : row.customer}
                              </TableCell>
                              <TableCell padding="none">
                                {persianNumber(
                                  new Date(row.date).toLocaleDateString(
                                    "fa-IR",
                                  ),
                                )}
                              </TableCell>
                              <TableCell padding="none">
                                {persianNumber(
                                  Number(row.price).toLocaleString(),
                                )}
                              </TableCell>
                              <TableCell padding="none">
                                {row.category}
                              </TableCell>
                              <TableCell padding="none">
                                <Chip
                                  label={Constant.INVOICE_TYPE[row.type]}
                                  className={clsx(
                                    classes.type,
                                    classes[row.type],
                                  )}
                                />
                              </TableCell>

                              <TableCell padding="none">
                                <TableRowMenu
                                  options={[
                                    // { id: "edit", title: "ویرایش" },
                                    { id: "delete", title: "حذف" },
                                  ]}
                                  hadleAction={(type) =>
                                    handleAction(row.id, type)
                                  }
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                        {!list.length && !getInvoiceRequest.pending && (
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
