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
  {
    id: "amount",
    label: "موجودی کل",
  },

  { id: "amount", label: "مقدار" },
  { id: "unit", label: " واحد شمارشی" },

  { id: "amount", label: "فی" },
];

const ProductList = React.forwardRef((props, ref) => {
  const { defaultValues } = props;
  const classes = styles();
  const [list, setList] = useState([]);
  const [showPerUnit, setShowPerUnit] = useState(
    defaultValues ? !!defaultValues.perUnit : false,
  );
  const units = unitAction.getProductUnit();
  const [depotPicker, setDepotPicker] = useState([]);
  const [selectedDepot, setSelectedDepot] = useState(1);

  useImperativeHandle(ref, () => {
    return list;
  });

  const getDepotProductRequest = useApi({
    method: "get",
    url: `product/depot?${convertParamsToQueryString({})}`,
  });

  const getDepotRequest = useApi({
    method: "get",
    url: `depot/picker`,
  });

  const getData = async () => {
    const productList = await getDepotProductRequest.execute(
      null,
      selectedDepot,
    );
    setList(productList.data);
  };

  const getProductUnitPicker = (row) => {
    const allUnits = units.filter((item) => item.value === row.unitBaseId)[0];

    if (allUnits) {
      return allUnits.children;
    }
    return [];
  };

  const getDepotPicker = async () => {
    const result = await getDepotRequest.execute();
    setDepotPicker(result.data);
  };

  const onChangeDepot = (e) => {
    setSelectedDepot(e.target.value);
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
  }, [selectedDepot]);

  useEffect(() => {
    getDepotPicker();
  }, []);

  return (
    <>
      <Grid container spacing={3}>
        <Grid item lg={12} xs={12} style={{ marginBottom: 20 }}>
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

      <TableContainer style={{ height: 200, overflow: "auto" }}>
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
                    {persianNumber(row.totalStock)}
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
                      select
                      value={row.unit}
                      onChange={(e) => onChangeProductValue(e, row)}
                      variant="outlined"
                      name="unit"
                      style={{ width: "70%" }}
                      size="small"
                    >
                      {getProductUnitPicker(row).map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </TableCell>
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
    </>
  );
});
export default ProductList;
