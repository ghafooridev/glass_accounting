import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableContainer,
  TableCell,
  TableRow,
  Typography,
  Chip,
  Button,
  Grid,
  Paper,
  TextField,
  ButtonGroup,
  AccordionSummary,
  AccordionDetails,
  Accordion,
  IconButt,
  MenuItem,
} from "@material-ui/core";
import clsx from "clsx";
import TableTop from "../../components/Table/TableTop";
import TableHeader from "../../components/Table/TableHead";
import TablePaging from "../../components/Table/TablePaging";
import { useApi } from "../../hooks/useApi";
import { convertParamsToQueryString } from "../../helpers/utils";
import styles from "./style";
import Constant from "../../helpers/constant";
import { useForm, Controller } from "react-hook-form";
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
    id: "amount",
    label: "موجودی کل",
  },
  { id: "unit", label: " واحد شمارشی" },

  { id: "action" },
];

export default function MainList({ onSelect, onDismiss }) {
  const classes = styles();
  const [order, setOrder] = useState("asc");
  const [search, setSearch] = useState();
  const [orderBy, setOrderBy] = useState("name");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(Constant.TABLE_PAGE_SIZE);
  const [list, setList] = useState([]);
  const units = unitAction.getProductUnit();
  const [selectedProduct, setSelectedProduct] = useState();

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

  const onChangeSelectedProduct = () => {};

  const onSearch = (value) => {
    setSearch(value);
  };

  const getData = async () => {
    const productList = await getProductRequest.execute();
    setList(productList.data);
  };

  const onSelectProduct = (data) => {
    console.log(data);
    setSelectedProduct(data);
  };

  const onDeselectProduct = () => {
    setSelectedProduct();
  };

  const onSubmit = () => {
    onSelect(selectedProduct);
  };

  useEffect(() => {
    getData();
  }, [page, order, search, pageSize]);

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
              value={selectedProduct?.name}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid item lg={6} xs={12}>
            <TextField
              select
              label="واحد شمارش"
              value={selectedProduct?.defaultUnit}
              onChange={onChangeSelectedProduct}
              variant="outlined"
              name="unitBase"
              fullWidth
              size="small"
            >
              {units.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item lg={6} xs={12}>
            <TextField
              variant="outlined"
              label="مقدار"
              name={"amount"}
              onChange={onChangeSelectedProduct}
              value={selectedProduct?.amount}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid item lg={6} xs={12}>
            <TextField
              variant="outlined"
              label="قیمت"
              name={"fee"}
              onChange={onChangeSelectedProduct}
              value={selectedProduct?.fee}
              fullWidth
              size="small"
            />
          </Grid>

          {!!selectedProduct && (
            <Grid
              item
              xs={12}
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Button variant="contained" color="primary" onClick={onSubmit}>
                تایید
              </Button>
            </Grid>
          )}
        </Grid>
      </form>

      <TableTop handleSearch={onSearch} />
      <TableContainer>
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
                        variant="contained"
                        className={classes.selectedButton}
                        onClick={() => onDeselectProduct(row)}
                        endIcon={<i className="material-icons-round">done</i>}
                      >
                        انتخاب شده
                      </Button>
                    ) : (
                      <Button
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
            {!list.length && !getProductRequest.pending && (
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
