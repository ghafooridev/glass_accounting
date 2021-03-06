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
import {
  convertParamsToQueryString,
  hasPermission,
  persianNumber,
} from "../../helpers/utils";
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
    id: "firstName",
    label: "نام",
  },
  {
    id: "mobile",
    label: "موبایل",
  },
  { id: "car", label: "خودرو" },
  { id: "pelak", label: "پلاک" },

  { id: "action" },
];

export default function MainList() {
  const classes = styles();
  const [order, setOrder] = useState("asc");
  const [search, setSearch] = useState();
  const [filter, setFilter] = useState();
  const [orderBy, setOrderBy] = useState("firstName");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(Constant.TABLE_PAGE_SIZE);
  const [list, setList] = useState([]);
  const history = useHistory();
  const [total, setTotal] = useState(0);

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
    history.push("/app/driver-detail");
  };

  const getDriverRequest = useApi({
    method: "get",
    url: decodeURIComponent(
      `driver?${convertParamsToQueryString({
        page,
        order,
        orderBy,
        pageSize,
        search,
        filter,
      })}`,
    ),
  });

  const deleteUseRequest = useApi({
    method: "delete",
    url: `driver`,
  });

  const handleAction = (id, type) => {
    const types = {
      edit: () => {
        history.push(`/app/driver-detail?id=${id}`);
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
      transaction: () => {
        history.push(`/app/person-transaction?id=${id}&type=employee`);
      },
    };
    if (types[type]) {
      types[type]();
    }
  };

  const onSearch = (value) => {
    setSearch(value);
    setPage(0);
  };

  const onFilter = (data) => {
    setFilter(data);
    setPage(0);
  };

  const getData = async () => {
    const driverList = await getDriverRequest.execute();
    setList(driverList.data);
    setTotal(driverList.total);
  };

  useEffect(() => {
    getData();
  }, [page, order, search, pageSize, filter]);

  return (
    <>
      {hasPermission(Constant.ALL_PERMISSIONS.DRIVER_SHOW) && (
        <Slide direction="down" in={true}>
          <div>
            {getDriverRequest.pending ? (
              <TableSkeleton headCount={headCells} />
            ) : (
              <div className={classes.root}>
                <Paper className={classes.paper}>
                  <TableTop
                    title="لیست رانندگان"
                    onAdd={
                      hasPermission(Constant.ALL_PERMISSIONS.DRIVER_EDIT) &&
                      onAdd
                    }
                    FilterComponent={<FilterComponent onFilter={onFilter} />}
                    handleSearch={onSearch}
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
                                {row.firstName}
                              </TableCell>
                              <TableCell padding="none">
                                {row.lastName}
                              </TableCell>
                              <TableCell padding="none">
                                {row.category.name}
                              </TableCell>
                              <TableCell padding="none">
                                {persianNumber(Number(row.mobile))}
                              </TableCell>

                              <TableCell padding="none">
                                {row.carName}
                              </TableCell>
                              <TableCell padding="none">
                                {row.carPlaque}
                              </TableCell>
                              <TableCell padding="none">
                                <TableRowMenu
                                  options={[
                                    { id: "transaction", title: "تراکنش ها" },
                                    {
                                      id: "edit",
                                      title: "ویرایش",
                                      hidden: !hasPermission(
                                        Constant.ALL_PERMISSIONS.DRIVER_EDIT,
                                      ),
                                    },
                                    {
                                      id: "delete",
                                      title: "حذف",
                                      hidden: !hasPermission(
                                        Constant.ALL_PERMISSIONS.DRIVER_DELETE,
                                      ),
                                    },
                                  ]}
                                  hadleAction={(type) =>
                                    handleAction(row.id, type)
                                  }
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                        {!list.length && !getDriverRequest.pending && (
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
