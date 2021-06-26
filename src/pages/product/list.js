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
import AmountBrif from "./amountBrif";
import Constant from "../../helpers/constant";
import { Slide } from "@material-ui/core";
import TableSkeleton from "../../components/Skeleton";
import Transform from "./transfer";
import unitAction from "../../redux/actions/unitAction";

const headCells = [
  {
    id: "name",
    label: "نام کالا",
  },
  {
    id: "category",
    label: "دسته بندی",
  },

  {
    id: "DefaultUnit",
    label: "واحد پیش فرض",
  },
  { id: "unit", label: " واحد شمارشی" },

  { id: "action" },
];

export default function MainList() {
  const classes = styles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [search, setSearch] = useState();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(Constant.TABLE_PAGE_SIZE);
  const [list, setList] = useState([]);
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
    history.push("/app/product-detail");
  };

  const getProductRequest = useApi({
    method: "get",
    url: `product?${convertParamsToQueryString({
      page,
      order,
      orderBy,
      pageSize,
      search,
    })}`,
  });

  const deleteUseRequest = useApi({
    method: "delete",
    url: `product`,
  });

  const transferRequest = useApi({
    method: "post",
    url: `depot/transfer`,
  });

  const addDriverRequest = useApi({
    method: "post",
    url: `driver`,
  });

  const onSearch = (value) => {
    setSearch(value);
  };

  const onSubmitTransfer = async (data) => {
    if (data.isAddDriver) {
      await addDriverRequest.execute(data.newDriver);
      await transferRequest.execute(data);
    } else {
      await transferRequest.execute(data);
    }
    DialogActions.hide();
  };

  const handleAction = (row, type) => {
    const { id } = row;
    const types = {
      edit: () => {
        history.push(`/app/product-detail?id=${id}`);
      },
      delete: () => {
        DialogActions.show({
          confirm: true,
          title: "ایا از حذف این رکورد مطمئن هستید ؟",
          onAction: async () => {
            await deleteUseRequest.execute(null, id);
            setList(list.filter((item) => item.id !== id));
            DialogActions.hide();
          },
          size: "sm",
          disableCloseButton: false,
        });
      },
      amount: () => {
        DialogActions.show({
          title: "موجودی در انبار ها",
          component: (
            <AmountBrif
              onSubmit={() => {
                DialogActions.hide();
              }}
              data={row.stocks}
            />
          ),
          size: "xs",
          confirm: false,
          disableCloseButton: true,
        });
      },
      transaction: () => {},

      transfer: () => {
        let units;
        const allUnits = unitAction
          .getProductUnit()
          .filter((item) => item.value === row.unitBaseId)[0];
        if (allUnits) {
          units = allUnits.children;
        }
        DialogActions.show({
          title: "انتقال بین انبار ها",
          component: (
            <Transform
              onDismiss={() => {
                DialogActions.hide();
              }}
              onSubmit={onSubmitTransfer}
              productId={row.id}
              units={units}
            />
          ),
          size: "xs",
          confirm: false,
          disableCloseButton: true,
        });
      },
    };
    if (types[type]) {
      types[type]();
    }
  };

  const getData = async () => {
    const productList = await getProductRequest.execute();
    setList(productList.data);
  };

  useEffect(() => {
    getData();
  }, [page, order, pageSize, search]);

  return (
    <>
      {hasPermission(Constant.ALL_PERMISSIONS.CASH_LIST) && (
        <Slide direction="down" in={true}>
          <div>
            {getProductRequest.pending ? (
              <TableSkeleton headCount={headCells} />
            ) : (
              <div className={classes.root}>
                <Paper className={classes.paper}>
                  <TableTop
                    title="لیست کالا ها"
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
                                {row.categories.join(",")}
                              </TableCell>

                              <TableCell padding="none">
                                {row.defaultUnit}
                              </TableCell>
                              <TableCell padding="none">
                                {row.unitBase}
                              </TableCell>

                              <TableCell padding="none">
                                <TableRowMenu
                                  options={[
                                    { id: "amount", title: "موجودی ها" },
                                    { id: "transaction", title: "تراکنش ها" },
                                    {
                                      id: "transfer",
                                      title: "انتقال بین انبار",
                                    },
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
                        {!list.length && !getProductRequest.pending && (
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
                    count={list.length}
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
