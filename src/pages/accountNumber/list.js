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
import TableRowMenu from "../../components/Table/TableRowMenu";
import TableTop from "../../components/Table/TableTop";
import TableHeader from "../../components/Table/TableHead";
import TablePaging from "../../components/Table/TablePaging";
import { useApi } from "../../hooks/useApi";
import { convertParamsToQueryString, hasPermission } from "../../helpers/utils";
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
    id: "type",
    label: "نوع",
  },
  {
    id: "logo",
    label: "بانک",
  },
  { id: "cardNumber", label: "شماره کارت" },
  { id: "action" },
];
const PERSON_TYPE = {
  EMPLOYEE: "پرسنل",
  CUSTOMER: "مشتری",
  DRIVER: "راننده",
};

const AccountsNumber = () => {
  const classes = styles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [search, setSearch] = useState();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(Constant.TABLE_PAGE_SIZE);
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [person, setPerson] = useState("ALL");

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

  const getCardRequest = useApi({
    method: "get",
    url: `account?${convertParamsToQueryString({
      page,
      order,
      orderBy,
      pageSize,
      search,
      personType: person,
    })}`,
  });

  const onDismissDetail = () => {
    DialogActions.hide({ name: "personAccount" });
  };

  const handleDetail = (row) => {
    DialogActions.show({
      title: `حساب های ${row.personName}`,
      component: <Detail onDismiss={onDismissDetail} detail={row} />,
      name: "personAccount",
      size: "6",
      confirm: false,
      disableCloseButton: false,
    });
  };

  const getData = async () => {
    const cardList = await getCardRequest.execute();
    setList(cardList.data);
    setTotal(cardList.total);
  };

  const onChangeTab = (e, value) => {
    setPerson(value);
  };

  useEffect(() => {
    getData();
  }, [page, order, search, pageSize, person]);

  return (
    <>
      {hasPermission(Constant.ALL_PERMISSIONS.CASH_LIST) && (
        <Slide direction="down" in={true}>
          <div>
            {getCardRequest.pending ? (
              <TableSkeleton headCount={headCells} />
            ) : (
              <div className={classes.root}>
                <Paper className={classes.paper}>
                  <TableTop
                    title="لیست حساب های بانکی"
                    handleSearch={onSearch}
                    defaultSearch={search}
                  />
                  <div className={classes.tab}>
                    <Tabs
                      value={person}
                      onChange={onChangeTab}
                      indicatorColor="primary"
                      textColor="primary"
                      centered
                      variant="fullWidth"
                    >
                      <Tab label="کل اشخاص " value="ALL" />
                      <Tab label="مشتریان" value="CUSTOMER" />
                      <Tab label="پرسنل" value="EMPLOYEE" />
                      <Tab label="رانندگان" value="DRIVER" />
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
                                {row.personName}
                              </TableCell>
                              <TableCell padding="none">
                                {PERSON_TYPE[row.personType]}
                              </TableCell>
                              <TableCell padding="none">
                                {row.bank && (
                                  <img
                                    style={{ width: 30, height: 30 }}
                                    alt={row.bank.name}
                                    src={`${Constant.API_ADDRESS}/${row.bank.logo}`}
                                  />
                                )}
                              </TableCell>
                              <TableCell padding="none">
                                {row.accountCardNumber}
                              </TableCell>

                              <TableCell padding="none">
                                <i
                                  className="material-icons-round"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => handleDetail(row)}
                                >
                                  link
                                </i>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                        {!list.length && !getCardRequest.pending && (
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

export default AccountsNumber;
