import React, { useEffect, useState, useImperativeHandle } from "react";
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
import TableHeader from "../../components/Table/TableHead";
import { useApi } from "../../hooks/useApi";
import { convertParamsToQueryString, persianNumber } from "../../helpers/utils";
import styles from "./style";
import unitAction from "../../redux/actions/unitAction";

const headCells = [
  {
    id: "name",
    label: "نام کالا",
  },
  { id: "amount", label: "فی" },
  { id: "amount", label: "مقدار" },
  {
    id: "total",
    label: "جمع کل",
  },
];

const ProductList = React.forwardRef((props, ref) => {
  const { defaultValues } = props;
  const classes = styles();
  const [list, setList] = useState([]);
  const [showPerUnit, setShowPerUnit] = useState(
    defaultValues ? !!defaultValues.perUnit : false,
  );
  const units = unitAction.getProductUnit();
  const [categoryPicker, setCategoryPicker] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(1);

  useImperativeHandle(ref, () => {
    return list;
  });

  const getCategoryProductRequest = useApi({
    method: "get",
    url: `product?filter={category:${selectedCategory}}`,
  });

  const getCategoryRequest = useApi({
    method: "get",
    url: `product/category`,
  });

  const getData = async () => {
    const productList = await getCategoryProductRequest.execute();
    setList(productList.data);
  };

  const getCategoryPicker = async () => {
    const result = await getCategoryRequest.execute();
    setCategoryPicker(result.data);
  };

  const onChangeCategory = (e) => {
    setSelectedCategory(e.target.value);
  };

  const onChangeProductValue = (e, data) => {
    const newList = [...list];
    const selectedCurrentProduct = list.find((item) => item.id === data.id);
    const index = list.findIndex((item) => item.id === data.id);
    selectedCurrentProduct[e.target.name] = e.target.value;
    newList[index] = selectedCurrentProduct;

    setList(newList);
  };

  useEffect(() => {
    getData();
  }, [selectedCategory]);

  useEffect(() => {
    getCategoryPicker();
  }, []);

  return (
    <>
      <Grid container spacing={3}>
        <Grid item lg={12} xs={12} style={{ marginBottom: 20 }}>
          <TextField
            select
            label="دسته بندی"
            value={selectedCategory}
            onChange={onChangeCategory}
            variant="outlined"
            name="category"
            fullWidth
            size="small"
          >
            {categoryPicker.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      <TableContainer style={{ overflow: "auto" }}>
        <Table className={classes.table} size={"medium"}>
          <TableHeader classes={classes} headCells={headCells} />

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
                    <TextField
                      type="number"
                      variant="outlined"
                      name="fee"
                      style={{ width: "70%" }}
                      size="small"
                      value={row.fee}
                      onChange={(e) => onChangeProductValue(e, row)}
                    />
                  </TableCell>

                  <TableCell padding="none">
                    <TextField
                      type="number"
                      variant="outlined"
                      name="amount"
                      style={{ width: "70%" }}
                      size="small"
                      value={row.amount}
                      onChange={(e) => onChangeProductValue(e, row)}
                    />
                  </TableCell>
                  <TableCell padding="none">
                    <TextField
                      type="number"
                      variant="outlined"
                      name="total"
                      style={{ width: "70%" }}
                      size="small"
                      value={row.amount * row.fee}
                      disabled
                    />
                  </TableCell>
                </TableRow>
              );
            })}
            {!list.length && !getCategoryProductRequest.pending && (
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
    </>
  );
});
export default ProductList;
