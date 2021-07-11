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
  TextField,
  Grid,
  Button,
} from "@material-ui/core";
import clsx from "clsx";
import TableTop from "../../components/Table/TableTop";
import TableHeader from "../../components/Table/TableHead";
import TablePaging from "../../components/Table/TablePaging";
import { useApi } from "../../hooks/useApi";
import {
  convertParamsToQueryString,
  hasPermission,
  getQueryString,
  persianNumber,
} from "../../helpers/utils";
import styles from "./style";
import FilterComponent from "./logFilter";
import Constant from "../../helpers/constant";
import { Slide } from "@material-ui/core";
import TableSkeleton from "../../components/Skeleton";
import Transction from "../customers/transaction";
import DialogActions from "../../redux/actions/dialogAction";
import moment from "moment-timezone";
import jMoment from "jalali-moment";

const headCells = [
  {
    id: "date",
    label: "تاریخ",
  },

  { id: "firstEnter", label: "ورود اول" },
  {
    id: "firstExit",
    label: "خروج اول",
  },
  { id: "secondEnter", label: "ورود دوم" },
  {
    id: "secondExit",
    label: "خروج دوم",
  },
  { id: "fractionTime", label: "کسر کار" },
  {
    id: "overTime",
    label: "اضافه کار",
  },
  {
    id: "total",
    label: "مجموع کارکرد",
  },
];

export default function EmployeeLog() {
  const classes = styles();
  const id = getQueryString("id");
  const name = getQueryString("name");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("date");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(Constant.TABLE_PAGE_SIZE);
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [sum, setSum] = useState();
  const history = useHistory();
  const [filter, setFilter] = useState(
    `{from:${jMoment(moment(), "YYYY/MM/DD")
      .locale("fa")
      .startOf("month")
      .toISOString()},to:${moment().toISOString()}}`,
  );
  // const [price, setPrice] = useState();
  // const [description, setDescription] = useState();
  // const [detail, setDetail] = useState({
  //   totalPay: " ",
  //   totalLogPay: " ",
  //   totalLog: " ",
  //   purePay: " ",
  //   SPH: " ",
  // });

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

  const onReject = () => {
    history.push("/customer-list");
  };

  const getEmployeeRequest = useApi({
    method: "get",
    url: decodeURIComponent(
      `attendance/employee?${convertParamsToQueryString({
        page,
        order,
        orderBy,
        pageSize,
        filter,
      })}`,
    ),
  });

  const onFilter = (data) => {
    setFilter(data);
  };

  const onShowPayments = () => {
    DialogActions.show({
      title: " حساب بانکی",
      component: (
        <Transction
        // onSubmit={onSubmitAccount}
        // onDismiss={onDismissAccount}
        // defaultValues={data}
        />
      ),
      name: "transaction",
      size: "4",
      confirm: false,
      disableCloseButton: true,
    });
  };

  const getData = async () => {
    const employeeList = await getEmployeeRequest.execute(null, id);
    setList(employeeList.data);
    setTotal(employeeList.total);
    setSum(employeeList.details);
  };

  const getTitle = () => {
    return `لیست تردد ${name}`;
  };

  const onSubmitNewPayment = () => {
    //add new payment in today and type ="outcome"
  };

  const onChange = (e, type) => {};

  useEffect(() => {
    getData();
  }, [page, order, pageSize, filter]);

  return (
    <>
      {hasPermission(Constant.ALL_PERMISSIONS.CASH_LIST) && (
        <Slide direction="down" in={true}>
          <div>
            {getEmployeeRequest.pending ? (
              <TableSkeleton headCount={headCells} />
            ) : (
              <>
                <Grid container spacing={3} className={classes.salary}>
                  {/* <Grid item xs={3}>
                    <Paper className={classes.salaryPaperRight}>
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <TextField
                            disabled
                            variant="outlined"
                            label="مجموع کارکرد"
                            name="totalLog"
                            value={detail.totalLog}
                            fullWidth
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            disabled
                            variant="outlined"
                            label="دریافتی در ساعت"
                            name="totalLog"
                            value={detail.SPH}
                            fullWidth
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            disabled
                            variant="outlined"
                            label="مبلغ قابل پرداخت"
                            name="totalLog"
                            value={detail.totalLogPay}
                            fullWidth
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            disabled
                            variant="outlined"
                            label="مجموع دریافتی"
                            name="totalLog"
                            value={detail.totalPay}
                            fullWidth
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            disabled
                            variant="outlined"
                            label="خالص دریافتی"
                            name="totalLog"
                            value={detail.purePay}
                            fullWidth
                            size="small"
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={onShowPayments}
                            fullWidth
                          >
                            لیست پرداختی ها
                          </Button>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                   */}
                  <Grid item xs={12}>
                    <Paper className={classes.salaryPaperLeft}>
                      <TableTop
                        title={getTitle()}
                        FilterComponent={
                          <FilterComponent onFilter={onFilter} />
                        }
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
                                    {persianNumber(
                                      new Date(row.date).toLocaleDateString(
                                        "fa-IR",
                                      ),
                                    )}
                                  </TableCell>
                                  <TableCell padding="none">
                                    {persianNumber(row.times[0]?.time)}
                                  </TableCell>
                                  <TableCell padding="none">
                                    {persianNumber(row.times[1]?.time)}
                                  </TableCell>
                                  <TableCell padding="none">
                                    {persianNumber(row.times[2]?.time)}
                                  </TableCell>
                                  <TableCell padding="none">
                                    {persianNumber(row.times[3]?.time)}
                                  </TableCell>
                                  <TableCell padding="none">
                                    {persianNumber(row.fractionTime)}
                                  </TableCell>
                                  <TableCell padding="none">
                                    {persianNumber(row.overTime)}
                                  </TableCell>
                                  <TableCell padding="none">
                                    {persianNumber(row.total)}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                            {!list.length && !getEmployeeRequest.pending && (
                              <TableRow style={{ height: 53 }}>
                                <TableCell
                                  colSpan={headCells.length}
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
                  </Grid>

                  <Grid item xs={12}>
                    <Paper className={classes.salaryPaperRight}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            disabled
                            variant="outlined"
                            label="مجموع کارکرد"
                            name="totalLog"
                            value={persianNumber(sum?.totalTime)}
                            fullWidth
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            disabled
                            variant="outlined"
                            label="مجموع اضافه کار"
                            name="totalLog"
                            value={persianNumber(sum?.totalOverTime)}
                            fullWidth
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            disabled
                            variant="outlined"
                            label="مجموع کسر کار"
                            name="totalLog"
                            value={persianNumber(sum?.totalFractionTime)}
                            fullWidth
                            size="small"
                          />
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                </Grid>
                {/* <Grid container spacing={3} className={classes.salary}>
                  <Grid item xs={3}>
                    <Paper className={classes.salaryPaperRight}>
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <TextField
                            variant="outlined"
                            label="مبلغ"
                            name="price"
                            onChange={(e) => onChange(e, "price")}
                            value={price}
                            fullWidth
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            rows={3}
                            multiline
                            variant="outlined"
                            label="بابت"
                            name="description"
                            onChange={(e) => onChange(e, "description")}
                            value={description}
                            fullWidth
                            size="small"
                          />
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginTop: 10,
                          flexDirection: "column",
                        }}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={onSubmitNewPayment}
                          fullWidth
                        >
                          پرداخت
                        </Button>
                        <Button
                          variant="contained"
                          color="Secondary"
                          onClick={onReject}
                          style={{ marginTop: 10 }}
                          fullWidth
                        >
                          بازگشت
                        </Button>
                      </Grid>
                    </Paper>
                  </Grid>
                </Grid>
              */}
              </>
            )}
          </div>
        </Slide>
      )}
    </>
  );
}
