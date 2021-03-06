import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableContainer,
  TableCell,
  TableRow,
  Typography,
  Button,
  Grid,
  TextField,
  MenuItem,
  Divider,
} from "@material-ui/core";
import TableTop from "../../components/Table/TableTop";
import TableHeader from "../../components/Table/TableHead";
import TablePaging from "../../components/Table/TablePaging";
import { useApi } from "../../hooks/useApi";
import { convertParamsToQueryString } from "../../helpers/utils";
import styles from "./style";
import Constant from "../../helpers/constant";
import { v4 as uuid } from "uuid";
import unitAction from "../../redux/actions/unitAction";
import isEmpty from "lodash.isempty";

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
    id: "amount",
    label: "موجودی کل",
  },
  { id: "unit", label: " واحد شمارشی" },

  { id: "action" },
];

export default function ProductList({
  onSubmit,
  onDismiss,
  customerId,
  defaultValues,
  action,
}) {
  const classes = styles();
  const [order, setOrder] = useState("asc");
  const [search, setSearch] = useState();
  const [orderBy, setOrderBy] = useState("name");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(Constant.TABLE_PAGE_SIZE);
  const [list, setList] = useState([]);
  const [showPerUnit, setShowPerUnit] = useState(
    defaultValues ? !!defaultValues.perUnit : false,
  );
  const units = unitAction.getProductUnit();
  const [selectedProduct, setSelectedProduct] = useState(defaultValues);
  const [depotPicker, setDepotPicker] = useState([]);
  const [selectedDepot, setSelectedDepot] = useState(1);
  const [productFee, setProductFee] = useState(
    defaultValues || {
      name: " ",
      fee: "",
      amount: "",
    },
  );
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

  const getDepotProductRequest = useApi({
    method: "get",
    url: `product/depot?${convertParamsToQueryString({
      page,
      order,
      orderBy,
      pageSize,
      search,
    })}`,
  });

  const getProductFeeRequest = useApi({
    method: "get",
    url: "invoice/fee",
  });

  const getDepotRequest = useApi({
    method: "get",
    url: `depot/picker`,
  });

  const onChangeSelectedProduct = (e) => {
    const { name, value } = e.target;

    if (name === "unit") {
      const allUnits = units.filter(
        (item) => item.value === selectedProduct?.unitBaseId,
      )[0].children;
      const targetUnit = allUnits.filter((item) => item.value === value)[0];
      setShowPerUnit(targetUnit.perUnit);
    }
    setProductFee({
      ...productFee,
      [name]: value,
      unitBaseId: selectedProduct?.unitBaseId,
    });
  };

  const onSearch = (value) => {
    setSearch(value);
  };

  const getData = async () => {
    const productList = await getDepotProductRequest.execute(
      null,
      selectedDepot,
    );
    setList(productList.data);
  };

  const getProductUnitPicker = () => {
    if (!isEmpty(selectedProduct)) {
      const allUnits = units.filter(
        (item) => item.value === selectedProduct.unitBaseId,
      )[0];

      if (allUnits) {
        return allUnits.children;
      }
      return [];
    }
    return [];
  };

  const onSelectProduct = async (data) => {
    setSelectedProduct(data);
    if (customerId === 1) {
      setProductFee({
        productId: data.id,
        name: data.name,
        fee: "",
        amount: "",
      });
    } else {
      const fee = await getProductFeeRequest.execute(
        null,
        `${customerId}/${data.id}`,
      );

      const feeProduct = fee.data;
      if (isEmpty(feeProduct)) {
        setProductFee({
          productId: data.id,
          name: data.name,
          fee: "",
          amount: "",
        });
      } else {
        setProductFee({ ...feeProduct, productId: data.id, name: data.name });
      }
    }
  };

  const onDeselectProduct = () => {
    setSelectedProduct();
  };

  const onDone = () => {
    const newId = uuid();
    const data = {
      id: defaultValues ? defaultValues.id : newId,
      ...productFee,
      depotId: selectedDepot,
      totalFee: Number(productFee.fee) * Number(productFee.amount),
    };

    onSubmit(data, action);
  };

  const getDepotPicker = async () => {
    const result = await getDepotRequest.execute();
    setDepotPicker(result.data);
  };

  const onChangeDepot = (e) => {
    setSelectedDepot(e.target.value);
  };

  useEffect(() => {
    getData();
  }, [page, order, search, pageSize, selectedDepot]);

  useEffect(() => {
    getDepotPicker();
  }, []);

  return (
    <>
      <form>
        <Grid container spacing={3}>
          <Grid item lg={6} xs={12}>
            <TextField
              variant="outlined"
              label="نام کالا"
              name={"name"}
              onChange={onChangeSelectedProduct}
              value={productFee.name}
              fullWidth
              size="small"
              disabled
            />
          </Grid>
          <Grid item lg={6} xs={12}>
            <TextField
              select
              label="واحد شمارش"
              value={productFee?.unit}
              onChange={onChangeSelectedProduct}
              variant="outlined"
              name="unit"
              fullWidth
              size="small"
            >
              {getProductUnitPicker().map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          {showPerUnit && (
            <Grid item lg={6} xs={12}>
              <TextField
                variant="outlined"
                label="مقدار در واحد"
                name={"perUnit"}
                onChange={onChangeSelectedProduct}
                value={productFee?.perUnit}
                fullWidth
                size="small"
                type="number"
              />
            </Grid>
          )}
          <Grid item lg={6} xs={12}>
            <TextField
              variant="outlined"
              label="مقدار"
              name={"amount"}
              onChange={onChangeSelectedProduct}
              value={productFee?.amount}
              fullWidth
              size="small"
              type="number"
            />
          </Grid>
          <Grid item lg={6} xs={12}>
            <TextField
              variant="outlined"
              label="قیمت"
              name={"fee"}
              onChange={onChangeSelectedProduct}
              value={productFee?.fee}
              fullWidth
              size="small"
              type="number"
            />
          </Grid>

          {!!selectedProduct && (
            <Grid
              item
              xs={12}
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Button variant="contained" color="primary" onClick={onDone}>
                تایید
              </Button>
            </Grid>
          )}
        </Grid>
      </form>
      <Divider style={{ margin: "20px 10px" }} />
      <Grid container spacing={3}>
        <Grid item lg={12} xs={12}>
          <TextField
            select
            label="انبار"
            value={selectedDepot}
            onChange={onChangeDepot}
            variant="outlined"
            name="depot"
            fullWidth
            size="small"
          >
            {depotPicker.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
      <TableContainer>
        <TableTop handleSearch={onSearch} defaultSearch={search} />

        <Table className={classes.table} size={"medium"}>
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
                  <TableCell padding="none">{row.totalStock}</TableCell>
                  <TableCell padding="none">{row.unitBase}</TableCell>
                  <TableCell padding="none">
                    {selectedProduct?.id === row.id ? (
                      <Button
                        disabled={!!defaultValues}
                        variant="contained"
                        className={classes.selectedButton}
                        onClick={() => onDeselectProduct(row)}
                        endIcon={<i className="material-icons-round">done</i>}
                      >
                        انتخاب شده
                      </Button>
                    ) : (
                      <Button
                        disabled={!!defaultValues}
                        variant="contained"
                        color="primary"
                        onClick={() => onSelectProduct(row)}
                      >
                        انتخاب کالا
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            {!list.length && !getDepotProductRequest.pending && (
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
        count={list.length}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        page={page}
        rowsPerPage={pageSize}
      />

      <Grid
        item
        xs={12}
        style={{ display: "flex", justifyContent: "flex-end" }}
      >
        <Button variant="contained" color="secondary" onClick={onDismiss}>
          انصراف
        </Button>
      </Grid>
    </>
  );
}
