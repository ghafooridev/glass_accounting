import React, { useEffect, useState } from "react";
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
import dialogAction from "../../redux/actions/dialogAction";
import CashSelector from "./cashSelector";
import SpendCheque from "./spendCheque";
import { Slide } from "@material-ui/core";
import TableSkeleton from "../../components/Skeleton";

const headCells = [
  {
    id: " date",
    label: "تاریخ سررسید",
  },
  {
    id: "number",
    label: "شماره چک",
  },
  {
    id: "bank",
    label: "بانک",
  },
  { id: "amount", label: "مبلغ" },
  { id: "person", label: "طرف حساب" },
  { id: "cashdesk", label: "محل چک" },
  { id: "type", label: "نوع تراکنش" },
  { id: "action" },
];

const MainList = () => {
  const classes = styles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("chequeDueDate");
  const [search, setSearch] = useState();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(Constant.TABLE_PAGE_SIZE);
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [paymentType, setPaymentType] = useState("ALL");

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

  const getChequeRequest = useApi({
    method: "get",
    url: `cheque?${convertParamsToQueryString({
      page,
      order,
      orderBy,
      pageSize,
      search,
      paymentType,
    })}`,
  });

  const spendRequest = useApi({
    method: "post",
    url: `cheque/spend`,
  });

  const sleepRequest = useApi({
    method: "post",
    url: `cheque/sleep`,
  });

  const onSelectCash = async (cashdeskId, chequeId) => {
    await sleepRequest.execute({ chequeId, cashdeskId });
    getData();
    DialogActions.hide();
  };

  const onSubmitSpend = async (data) => {
    console.log(data);
    await spendRequest.execute(data);
    getData();
    DialogActions.hide();
  };

  const handleAction = (row, type) => {
    const types = {
      sleep: () => {
        dialogAction.show({
          title: "انتخاب صندوق",
          component: (
            <CashSelector
              chequeId={row.id}
              onSelect={onSelectCash}
              onDismiss={() => DialogActions.hide()}
            />
          ),
          size: "lg",
          confirm: false,
          disableCloseButton: false,
        });
      },
      spend: () => {
        dialogAction.show({
          title: "خرج چک",
          component: (
            <SpendCheque
              chequeId={row.id}
              onSubmit={onSubmitSpend}
              onDismiss={() => DialogActions.hide()}
            />
          ),
          size: "sm",
          confirm: false,
          disableCloseButton: false,
        });
      },
      revert: () => {
        DialogActions.show({
          confirm: true,
          title: "ایا از برداشتن این چک مطمئن هستید ؟",
          onAction: async () => {
            onSelectCash({ cashdeskId: 1, chequeId: row.id });
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

  const onChangeType = (data, e) => {
    setPaymentType(e);
  };

  const getActionOptions = (data) => {
    if (data.type === "INCOME" && data.status === "PENDING") {
      return (
        <TableCell padding="none">
          <TableRowMenu
            options={[
              { id: "sleep", title: "خواباندن به حساب" },
              { id: "spend", title: "خرج کردن چک" },
            ]}
            hadleAction={(type) => handleAction(data, type)}
          />
        </TableCell>
      );
    } else if (data.type === "INCOME" && data.status === "SLEEP") {
      return (
        <TableCell padding="none">
          <TableRowMenu
            options={[{ id: "revert", title: "برداشتن از حساب" }]}
            hadleAction={(type) => handleAction(data, type)}
          />
        </TableCell>
      );
    } else {
      return <TableCell padding="none" />;
    }
  };

  const getData = async () => {
    const chequeList = await getChequeRequest.execute();
    setList(chequeList.data);
    setTotal(chequeList.total);
  };

  useEffect(() => {
    getData();
  }, [page, order, search, pageSize, paymentType]);

  return (
    <>
      {hasPermission(Constant.ALL_PERMISSIONS.CASH_LIST) && (
        <Slide direction="down" in={true}>
          <div>
            {getChequeRequest.pending ? (
              <TableSkeleton headCount={headCells} />
            ) : (
              <div className={classes.root}>
                <Paper className={classes.paper}>
                  <TableTop
                    title="لیست چک ها"
                    handleSearch={onSearch}
                    defaultSearch={search}
                  />
                  <div className={classes.tab}>
                    <Tabs
                      variant="fullWidth"
                      value={paymentType}
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
                        label="کل چک ها"
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
                            trending_up
                          </i>
                        }
                        label="چک های دریافتی"
                        value="INCOME"
                      />
                      <Tab
                        icon={
                          <i
                            className={clsx(
                              "material-icons-round",
                              classes.outgoIcon,
                            )}
                          >
                            trending_down
                          </i>
                        }
                        label="چک های پرداختی"
                        value="OUTCOME"
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
                                {persianNumber(
                                  new Date(
                                    row.chequeDueDate,
                                  ).toLocaleDateString("fa-IR"),
                                )}
                              </TableCell>
                              <TableCell padding="none">
                                {persianNumber(row.chequeNumber)}
                              </TableCell>
                              <TableCell padding="none">
                                {row.bank && (
                                  <img
                                    style={{ width: 40, height: 40 }}
                                    alt={row.bank.name}
                                    src={`${Constant.API_ADDRESS}/${row.bank.logo}`}
                                  />
                                )}
                              </TableCell>
                              <TableCell padding="none">
                                {persianNumber(
                                  Number(row.price).toLocaleString(),
                                )}
                              </TableCell>
                              <TableCell padding="none">{row.person}</TableCell>
                              <TableCell padding="none">
                                {row.cashDeskName}
                              </TableCell>
                              <TableCell padding="none">
                                <Chip
                                  label={Constant.PAYMENT_TYPE[row.type]}
                                  className={clsx(
                                    classes.chip,
                                    classes[row.type],
                                  )}
                                />
                              </TableCell>

                              {getActionOptions(row)}
                            </TableRow>
                          );
                        })}
                        {!list.length && !getChequeRequest.pending && (
                          <TableRow style={{ height: 53 }}>
                            <TableCell
                              colSpan={10}
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
