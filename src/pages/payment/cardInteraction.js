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
  Button,
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
  { id: "personType" },
  {
    id: "person",
    label: "نام شخص",
  },
  {
    id: "date",
    label: "تاریخ",
  },
  { id: "price", label: "مبلغ" },
  {
    id: "typr",
    label: "نوع",
  },

  // { id: "action" },
];

const MainList = () => {
  const paymentType = getQueryString("type");
  const classes = styles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("date");
  const [search, setSearch] = useState();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(Constant.TABLE_PAGE_SIZE);
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [type, setType] = useState(paymentType);
  const [filter, setFilter] = useState();
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

  const getPaymentRequest = useApi({
    method: "get",
    url: decodeURIComponent(
      `payment?${convertParamsToQueryString({
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
    url: `payment`,
  });

  const onDeleteRow = (row) => {
    DialogActions.show({
      confirm: true,
      title: "ایا از حذف این رکورد مطمئن هستید ؟",
      onAction: async () => {
        await deleteUseRequest.execute(null, row.id);
        setList(list.filter((item) => item.id !== row.id));
        DialogActions.hide();
      },
      size: "6",
      disableCloseButton: false,
    });
  };

  const getData = async () => {
    const paymentList = await getPaymentRequest.execute();
    setList(paymentList.data);
    setTotal(paymentList.total);
  };

  useEffect(() => {
    getData();
  }, [page, order, pageSize]);

  return (
    <>
      {hasPermission(Constant.ALL_PERMISSIONS.PAYMENT_SHOW) && (
        <Slide direction="down" in={true}>
          <div>
            {getPaymentRequest.pending ? (
              <TableSkeleton headCount={headCells} />
            ) : (
              <div className={classes.root}>
                <Paper className={classes.paper}>
                  <TableTop
                    title="انتقالات کارت"
                    // onAdd={type !== "ALL" && onAdd}
                    // handleSearch={onSearch}
                    // defaultSearch={search}
                    // FilterComponent={<FilterComponent onFilter={onFilter} />}
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
                                {row.paymentname}
                              </TableCell>
                              <TableCell padding="none">{row.person}</TableCell>
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
                                <Chip
                                  label={Constant.PAYMENT_TYPE[row.type]}
                                  className={clsx(
                                    classes.type,
                                    classes[row.type],
                                  )}
                                />
                              </TableCell>
                              <TableCell padding="none">
                                <Button
                                  variant={"contained"}
                                  color={"primary"}
                                  onClick={() => onDeleteRow(row)}
                                >
                                  {"انجام شد"}
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                        {!list.length && !getPaymentRequest.pending && (
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
