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
  Tab,
  Tabs,
} from "@material-ui/core";
import TableTop from "../../components/Table/TableTop";
import TableHeader from "../../components/Table/TableHead";
import TablePaging from "../../components/Table/TablePaging";
import { useApi } from "../../hooks/useApi";
import {
  getQueryString,
  convertParamsToQueryString,
  hasPermission,
  persianNumber,
} from "../../helpers/utils";
import styles from "./style";
import Constant from "../../helpers/constant";
import PaymentDetail from "./paymentDetail";
import DialogActions from "../../redux/actions/dialogAction";
import { Slide } from "@material-ui/core";
import TableSkeleton from "../../components/Skeleton";

const headCells = [
  {
    id: "date",
    label: "تاریخ",
  },
  {
    id: "name",
    label: "نام شخص",
  },
  {
    id: "type",
    label: "نوع",
  },
  {
    id: "price",
    label: "مبلغ",
  },

  { id: "action" },
];

const types = {
  CASH: "نقد",
  CHEQUE: "چک",
  BANK: "بانک",
};

const PaymentReport = () => {
  const classes = styles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("price");
  const [search, setSearch] = useState();
  const [page, setPage] = useState(0);
  const cashId = getQueryString("cashId");
  const [pageSize, setPageSize] = useState(Constant.TABLE_PAGE_SIZE);
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const history = useHistory();
  const [type, setPerson] = useState("CASH");

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
  };

  const getPaymentByCashRequest = useApi({
    method: "get",
    url: `payment/cashdesk?${convertParamsToQueryString({
      page,
      order,
      orderBy,
      pageSize,
      search,
      type,
    })}`,
  });

  const onDismissDetail = () => {
    DialogActions.hide({ name: "detail" });
  };

  const handleDetail = (row) => {
    DialogActions.show({
      title: `${
        row.paymentType === "INCOME" ? "جزییات دریافت" : "جزییات پرداخت"
      } `,
      component: (
        <PaymentDetail onDismiss={onDismissDetail} data={row} type={row.type} />
      ),
      name: "detail",
      size: "6",
      confirm: false,
      disableCloseButton: false,
    });
  };

  const onClicKRow = (e, row) => {
    if (e.target.tagName === "TD") {
      handleDetail(row);
    }
  };

  const getData = async () => {
    const paymentList = await getPaymentByCashRequest.execute(null, cashId);
    setList(paymentList.data);
    setTotal(paymentList.total);
  };

  const onChangeTab = (e, value) => {
    setPerson(value);
  };

  useEffect(() => {
    getData();
  }, [page, order, search, pageSize, type]);

  return (
    <>
      {hasPermission(Constant.ALL_PERMISSIONS.CASH_LIST) && (
        <Slide direction="down" in={true}>
          <div>
            {getPaymentByCashRequest.pending ? (
              <TableSkeleton headCount={headCells} />
            ) : (
              <div className={classes.root}>
                <Paper className={classes.paper}>
                  <TableTop
                    title="لیست تراکنش های صندوق "
                    handleSearch={onSearch}
                    defaultSearch={search}
                  />
                  <div className={classes.tab}>
                    <Tabs
                      value={type}
                      onChange={onChangeTab}
                      indicatorColor="primary"
                      textColor="primary"
                      centered
                      variant="fullWidth"
                    >
                      <Tab label="نقدی" value="CASH" />
                      <Tab label="بانکی" value="BANK" />
                      <Tab label="چک" value="CHEQUE" />
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
                              onClick={(e) => onClicKRow(e, row)}
                            >
                              <TableCell padding="none">
                                {persianNumber(
                                  new Date(row.date).toLocaleDateString(
                                    "fa-IR",
                                  ),
                                )}
                              </TableCell>
                              <TableCell padding="none"> {row.name}</TableCell>
                              <TableCell padding="none">
                                {types[row.type]}
                              </TableCell>
                              <TableCell padding="none">
                                {persianNumber(
                                  Number(row.price).toLocaleString(),
                                )}
                              </TableCell>

                              <TableCell padding="none">
                                <i
                                  className="material-icons-round"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => handleDetail(row)}
                                >
                                  feed
                                </i>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                        {!list.length && !getPaymentByCashRequest.pending && (
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

export default PaymentReport;
