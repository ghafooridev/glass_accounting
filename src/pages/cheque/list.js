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
import { convertParamsToQueryString } from "../../helpers/utils";
import DialogActions from "../../redux/actions/dialogAction";
import styles from "./style";
import Constant from "../../helpers/constant";
import clsx from "clsx";
import dialogAction from "../../redux/actions/dialogAction";
import CashSelector from "./cashSelector";
import SpendCheque from "./spendCheque";

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
  const [orderBy, setOrderBy] = useState("name");
  const [search, setSearch] = useState();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(Constant.TABLE_PAGE_SIZE);
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [type, setType] = useState();
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
    history.push("/app/cheque-detail");
  };

  const onSearch = (value) => {
    setSearch(value);
  };

  const getChequeRequest = useApi({
    method: "get",
    url: `chequedesk?${convertParamsToQueryString({
      page,
      order,
      orderBy,
      pageSize,
      search,
    })}`,
  });

  const deleteUseRequest = useApi({
    method: "delete",
    url: `chequedesk`,
  });

  const onSelectCash = (id) => {
    // TODO:call api for sleeping
  };

  const onSubmitSpend = () => {};

  const handleAction = (row, type) => {
    const types = {
      edit: () => {
        history.push(`/app/cheque-detail?id=${row.id}`);
      },
      delete: () => {
        DialogActions.show({
          confirm: true,
          title: "ایا از حذف این رکورد مطمئن هستید ؟",
          onAction: async () => {
            await deleteUseRequest.execute(null, row.id);
            setList(list.filter((item) => item.id !== row.id));
            DialogActions.hide();
          },
          size: "sm",
          disableCloseButton: false,
        });
      },
      sleep: () => {
        dialogAction.show({
          title: "انتخاب صندوق",
          component: (
            <CashSelector
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
              onSubmit={onSubmitSpend}
              onDismiss={() => DialogActions.hide()}
            />
          ),
          size: "sm",
          confirm: false,
          disableCloseButton: false,
        });
      },
    };
    if (types[type]) {
      types[type]();
    }
  };

  const onChangeType = (data) => {
    setType(data);
  };

  const getActionOptions = (data) => {
    const menu = [
      { id: "edit", title: "ویرایش" },
      { id: "delete", title: "حذف" },
    ];

    if (data.type === "INCOME" && data.cashDeskType === "NAGHD") {
      menu.push({ id: "sleep", title: "خواباندن به حساب" });
      menu.push({ id: "spend", title: "خرج کردن چک" });
    }

    return menu;
  };

  const getData = async () => {
    const chequeList = await getChequeRequest.execute();
    setList(chequeList.data);
    setTotal(chequeList.total);
  };

  useEffect(() => {
    getData();
  }, [page, order, search, pageSize]);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableTop title="لیست صندوق ها" onAdd={onAdd} handleSearch={onSearch} />
        <div className={classes.tab}>
          <Tabs
            value={type}
            onChange={onChangeType}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab
              icon={
                <i className={clsx("material-icons-round", classes.allIcon)}>
                  sync
                </i>
              }
              label="کل چک ها"
              value="ALL"
            />
            <Tab
              icon={
                <i className={clsx("material-icons-round", classes.incomeIcon)}>
                  trending_up
                </i>
              }
              label="چک های دریافتی"
              value="INCOME"
            />
            <Tab
              icon={
                <i className={clsx("material-icons-round", classes.outgoIcon)}>
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
                    <TableCell padding="none">{row.chequeDueDate}</TableCell>
                    <TableCell padding="none">{row.chequeNumber}</TableCell>
                    <TableCell padding="none">
                      {row.bank && (
                        <img
                          style={{ width: 40, height: 40 }}
                          alt={row.bank.name}
                          src={`${Constant.API_ADDRESS}/${row.bank.logo}`}
                        />
                      )}
                    </TableCell>
                    <TableCell padding="none">{row.price}</TableCell>
                    <TableCell padding="none">{row.person}</TableCell>
                    <TableCell padding="none">{row.cashDesk}</TableCell>
                    <TableCell padding="none">
                      <Chip
                        label={Constant.PAYMENT_TYPE[row.type]}
                        className={clsx(classes.type, classes[row.type])}
                      />
                    </TableCell>

                    <TableCell padding="none">
                      <TableRowMenu
                        options={() => getActionOptions(row)}
                        hadleAction={(type) => handleAction(row.id, type)}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
              {!list.length && !getChequeRequest.pending && (
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
