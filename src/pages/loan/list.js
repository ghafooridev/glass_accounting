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
import Constant from "../../helpers/constant";
import Detail from "./detail";
import { Slide } from "@material-ui/core";
import TableSkeleton from "../../components/Skeleton";

const headCells = [
  {
    id: "name",
    label: "نام شخص",
  },
  {
    id: "Date",
    label: "تاریخ",
  },
  {
    id: "price",
    label: "مانده وام",
  },
  { id: "personType", label: "نوع شخص" },
  // { id: "action" },
];
const PERSON_TYPE = {
  EMPLOYEE: "پرسنل",
  CUSTOMER: "مشتری",
  DRIVER: "راننده",
};

const MainList = () => {
  const classes = styles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("date");
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
    setPageSize(event.target.value);
    setPage(0);
  };

  const onSearch = (value) => {
    setSearch(value);
    setPage(0);
  };

  const onAdd = () => {
    history.push(`/app/payment-detail?type=OUTCOME&loan=true`);
  };

  const getLoanRequest = useApi({
    method: "get",
    url: `loan?${convertParamsToQueryString({
      page,
      order,
      orderBy,
      pageSize,
      search,
    })}`,
  });

  const onDismissDetail = () => {
    DialogActions.hide({ name: "detail" });
  };

  const handleDetail = (row) => {
    // DialogActions.show({
    //   title: `حساب های ${row.personName}`,
    //   component: <Detail onDismiss={onDismissDetail} detail={row} />,
    // name:"detail",
    //   size: "6",
    //   confirm: false,
    //   disableCloseButton: false,
    // });
  };

  const getData = async () => {
    const cardList = await getLoanRequest.execute();
    setList(cardList.data);
    setTotal(cardList.total);
  };

  useEffect(() => {
    getData();
  }, [page, order, search, pageSize]);

  return (
    <>
      {hasPermission(Constant.ALL_PERMISSIONS.CASH_LIST) && (
        <Slide direction="down" in={true}>
          <div>
            {getLoanRequest.pending ? (
              <TableSkeleton headCount={headCells} />
            ) : (
              <div className={classes.root}>
                <Paper className={classes.paper}>
                  <TableTop
                    title="لیست وام ها"
                    onAdd={onAdd}
                    // handleSearch={onSearch}
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
                                {row.personName}
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
                                {PERSON_TYPE[row.personType]}
                              </TableCell>

                              {/* <TableCell padding="none">
                                <i
                                  className="material-icons-round"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => handleDetail(row)}
                                >
                                  link
                                </i>
                              </TableCell> */}
                            </TableRow>
                          );
                        })}
                        {!list.length && !getLoanRequest.pending && (
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
