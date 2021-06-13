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
import Transfer from "./transfer";
import { Slide } from "@material-ui/core";
import TableSkeleton from "../../components/Skeleton";

const headCells = [
  {
    id: "name",
    label: "نام صندوق",
  },
  {
    id: "type",
    label: "نوع",
  },
  {
    id: "logo",
    label: "بانک",
  },
  { id: "amount", label: "موجودی" },

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
    history.push("/app/cash-detail");
  };

  const onSearch = (value) => {
    setSearch(value);
  };

  const getCashRequest = useApi({
    method: "get",
    url: `cashdesk?${convertParamsToQueryString({
      page,
      order,
      orderBy,
      pageSize,
      search,
    })}`,
  });

  const deleteCashRequest = useApi({
    method: "delete",
    url: `cashdesk`,
  });

  const transferCashDesk = useApi({
    method: "post",
    url: "cashdesk/transfer",
  });

  const onDismissTransfer = () => {
    DialogActions.hide();
  };

  const onSubmitTransfer = async (data) => {
    await transferCashDesk.execute(data);
    getData();
    DialogActions.hide();
  };

  const handleAction = (row, type) => {
    const types = {
      edit: () => {
        history.push(`/app/cash-detail?id=${row.id}`);
      },
      delete: () => {
        DialogActions.show({
          confirm: true,
          title: "ایا از حذف این رکورد مطمئن هستید ؟",
          onAction: async () => {
            await deleteCashRequest.execute(null, row.id);
            setList(list.filter((item) => item.id !== row.id));
            DialogActions.hide();
          },
          size: "sm",
          disableCloseButton: false,
        });
      },
      transfer: () => {
        DialogActions.show({
          title: "انتقال بین صندوق ها",
          component: (
            <Transfer
              onSubmit={onSubmitTransfer}
              onDismiss={onDismissTransfer}
              source={row.id}
            />
          ),
          size: "xs",
          confirm: false,
          disableCloseButton: false,
        });
      },
    };
    if (types[type]) {
      types[type]();
    }
  };

  const getData = async () => {
    const cashList = await getCashRequest.execute();
    setList(cashList.data);
    setTotal(cashList.total);
  };

  useEffect(() => {
    getData();
  }, [page, order, search, pageSize]);
 
  return (
    <>
      {hasPermission(Constant.ALL_PERMISSIONS.CASH_LIST) && (
        <Slide direction="down" in={true}>
          <div>
            {getCashRequest.pending ? (
              <TableSkeleton headCount={headCells} />
            ) : (
              <div className={classes.root}>
                <Paper className={classes.paper}>
                  <TableTop
                    title="لیست صندوق ها"
                    onAdd={onAdd}
                    handleSearch={onSearch}
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
                              <TableCell padding="none">{row.name}</TableCell>
                              <TableCell padding="none">
                                {row.type === "CASH" ? "نقدی" : "بانکی"}
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
                              <TableCell padding="none">{row.amount}</TableCell>

                              <TableCell padding="none">
                                <TableRowMenu
                                  options={[
                                    { id: "transfer", title: "انتقال" },
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
                        {!list.length && !getCashRequest.pending && (
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
