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
  Tab,
  Tabs,
} from "@material-ui/core";
import clsx from "clsx";
import TableRowMenu from "../../components/Table/TableRowMenu";
import TableTop from "../../components/Table/TableTop";
import TableHeader from "../../components/Table/TableHead";
import TablePaging from "../../components/Table/TablePaging";
import { useApi } from "../../hooks/useApi";
import { convertParamsToQueryString, hasPermission } from "../../helpers/utils";
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
    id: "محل خدمت",
    label: "محل خدمت",
  },
  {
    id: "mobile",
    label: "موبایل",
  },
  { id: "status", label: "وضعیت" },
  { id: "action" },
];

export default function MainList() {
  const CONTERACT_TYPE = {
    DEPOT: "انبار",
    FACTORY1: "کارخانه یک",
    FACTORY2: "کارخانه دو",
  };
  const classes = styles();
  const [order, setOrder] = useState("asc");
  const [search, setSearch] = useState();
  const [orderBy, setOrderBy] = useState("firstName");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(Constant.TABLE_PAGE_SIZE);
  const [list, setList] = useState([]);
  const [type, setType] = useState("ALL");
  const [filter, setFilter] = useState();
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

  const onAdd = () => {
    history.push("/app/employee-detail");
  };

  const getEmployeeRequest = useApi({
    method: "get",
    url: decodeURIComponent(
      `employee?${convertParamsToQueryString({
        page,
        order,
        orderBy,
        pageSize,
        search,
        filter,
        type,
      })}`,
    ),
  });

  const deleteUseRequest = useApi({
    method: "delete",
    url: `employee`,
  });

  const handleAction = (row, type) => {
    const { id, firstName, lastName } = row;
    const types = {
      edit: () => {
        history.push(`/app/employee-detail?id=${id}`);
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
      traffic: () => {
        history.push(
          `/app/employee-log?id=${id}&name=${firstName} ${lastName}`,
        );
      },
      transaction: () => {
        history.push(`/app/person-transaction?id=${id}&type=employee`);
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
    const properData = `{name:${data.name},status:${data.status}}`;
    setFilter(properData);
    setPage(0);
  };

  const onChangeType = (e, value) => {
    setType(value);
    setPage(0);
  };

  const getData = async () => {
    const employeeList = await getEmployeeRequest.execute();
    setList(employeeList.data);
    setTotal(employeeList.total);
  };

  useEffect(() => {
    getData();
  }, [page, order, search, pageSize, type, filter]);

  return (
    <>
      {hasPermission(Constant.ALL_PERMISSIONS.EMPLOYEE_SHOW) && (
        <Slide direction="down" in={true}>
          <div>
            {getEmployeeRequest.pending ? (
              <TableSkeleton headCount={headCells} />
            ) : (
              <div className={classes.root}>
                <Paper className={classes.paper}>
                  <TableTop
                    title="لیست پرسنل"
                    onAdd={
                      hasPermission(Constant.ALL_PERMISSIONS.EMPLOYEE_EDIT) &&
                      onAdd
                    }
                    FilterComponent={<FilterComponent onFilter={onFilter} />}
                    // handleSearch={onSearch}
                    defaultSearch={search}
                  />
                  <div className={classes.tab}>
                    <Tabs
                      value={type}
                      onChange={onChangeType}
                      indicatorColor="primary"
                      textColor="primary"
                      centered
                      variant="fullWidth"
                    >
                      <Tab label="کل پرسنل" value="ALL" />

                      <Tab label="پرسنل کارخانه یک" value="FACTORY1" />
                      <Tab label="پرسنل کارخانه دو" value="FACTORY2" />
                      <Tab label="پرسنل انبار" value="DEPOT" />
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
                                {row.firstName}
                              </TableCell>
                              <TableCell padding="none">
                                {row.lastName}
                              </TableCell>
                              <TableCell padding="none">
                                {CONTERACT_TYPE[row.contractType]}
                              </TableCell>

                              <TableCell padding="none">{row.mobile}</TableCell>
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
                                    { id: "traffic", title: "گزارش تردد" },
                                    {
                                      id: "edit",
                                      title: "ویرایش",
                                      hidden: !hasPermission(
                                        Constant.ALL_PERMISSIONS.EMPLOYEE_EDIT,
                                      ),
                                    },
                                    {
                                      id: "delete",
                                      title: "حذف",
                                      hidden: !hasPermission(
                                        Constant.ALL_PERMISSIONS
                                          .EMPLOYEE_DELETE,
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
                        {!list.length && !getEmployeeRequest.pending && (
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
