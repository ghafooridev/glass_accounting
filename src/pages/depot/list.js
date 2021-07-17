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
import { Slide } from "@material-ui/core";
import TableSkeleton from "../../components/Skeleton";
import AmountBrif from "./amountBrif";

const headCells = [
  {
    id: "name",
    label: "نام انبار",
  },
  {
    id: "category",
    label: "دسته بندی انبار",
  },
  { id: "phone", label: "تلفن" },

  { id: "action" },
];

const MainList = () => {
  const classes = styles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState();
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
    history.push("/app/depot-detail");
  };

  const onSearch = (value) => {
    setSearch(value);
    setPage(0);
  };

  const getDepotRequest = useApi({
    method: "get",
    url: `depot?${convertParamsToQueryString({
      page,
      order,
      orderBy,
      pageSize,
      search,
    })}`,
  });

  const deleteUseRequest = useApi({
    method: "delete",
    url: `depot`,
  });

  const handleAction = (row, type) => {
    const types = {
      amount: () => {
        DialogActions.show({
          title: "موجودی در انبار ها",
          component: (
            <AmountBrif
              onSubmit={() => {
                DialogActions.hide({ name: "amount" });
              }}
              depotId={row.id}
            />
          ),
          name: "amount",
          size: "4",
          confirm: false,
          disableCloseButton: true,
        });
      },

      edit: () => {
        history.push(`/app/depot-detail?id=${row.id}`);
      },
      delete: () => {
        DialogActions.show({
          confirm: true,
          title: "ایا از حذف این رکورد مطمئن هستید ؟",
          onAction: async () => {
            await deleteUseRequest.execute(null, row.id);
            setList(list.filter((item) => item.id !== row.id));
            DialogActions.hide({ name: "delete" });
          },
          name: "delete",
          size: "6",
          disableCloseButton: false,
        });
      },
    };
    if (types[type]) {
      types[type]();
    }
  };

  const getData = async () => {
    const depotList = await getDepotRequest.execute();
    setList(depotList.data);
    setTotal(depotList.total);
  };

  useEffect(() => {
    getData();
  }, [page, order, pageSize, search]);

  return (
    <>
      {hasPermission(Constant.ALL_PERMISSIONS.DEPOT_SHOW) && (
        <Slide direction="down" in={true}>
          <div>
            {getDepotRequest.pending ? (
              <TableSkeleton headCount={headCells} />
            ) : (
              <div className={classes.root}>
                <Paper className={classes.paper}>
                  <TableTop
                    title="لیست انبار ها"
                    onAdd={
                      hasPermission(Constant.ALL_PERMISSIONS.DEPOT_EDIT) &&
                      onAdd
                    }
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
                              <TableCell padding="none">{row.name}</TableCell>
                              <TableCell padding="none">
                                {row.depotCategory}
                              </TableCell>
                              <TableCell padding="none">{row.phone}</TableCell>

                              <TableCell padding="none">
                                <TableRowMenu
                                  options={[
                                    { id: "amount", title: "موجودی" },
                                    {
                                      id: "edit",
                                      title: "ویرایش",
                                      hidden: !hasPermission(
                                        Constant.ALL_PERMISSIONS.DEPOT_EDIT,
                                      ),
                                    },
                                    {
                                      id: "delete",
                                      title: "حذف",
                                      hidden: !hasPermission(
                                        Constant.ALL_PERMISSIONS.DEPOT_DELETE,
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
                        {!list.length && !getDepotRequest.pending && (
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
