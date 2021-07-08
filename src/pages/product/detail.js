import React, { Fragment, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Table,
  TableBody,
  TableContainer,
  TableCell,
  TableRow,
  IconButton,
  Select,
  FormControl,
  InputLabel,
} from "@material-ui/core";
import TableHeader from "../../components/Table/TableHead";
import { DeleteIcon, EditIcon } from "../../components/icons";
import { useForm, Controller } from "react-hook-form";
import { useApi } from "../../hooks/useApi";
import Constant from "../../helpers/constant";
import { getQueryString, persianNumber } from "../../helpers/utils";
import CircularProgress from "../../components/CircularProgress";
import DialogActions from "../../redux/actions/dialogAction";
import Amount from "./amount";
import unitAction from "../../redux/actions/unitAction";
import { isEmpty } from "lodash";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "0 auto",
  },
  paper: {
    width: "100%",
    padding: 20,
  },
  title: {
    paddingBottom: 20,
  },
  deleteIcon: {
    color: theme.palette.error.main,
  },
  formControl: {
    width: "100%",
  },
}));

const headCells = [
  {
    id: "amount",
    label: "موجودی",
  },
  { id: "unit", label: "واحد" },
  {
    id: "depot",
    label: "انبار",
  },

  { id: "action" },
];

export default function MainDetail() {
  const classes = useStyles();
  const history = useHistory();
  const id = getQueryString("id");
  const [detail, setDetail] = useState({});
  const [amounts, setAmounts] = useState([]);
  const [category, setCategory] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState("MASS");
  const [selectedCategory, setSelectedCategory] = useState([1]);
  const { control, handleSubmit, errors, reset } = useForm();
  const units = unitAction.getProductUnit();

  const addProductRequest = useApi({
    method: "post",
    url: `product`,
  });
  const editProductRequest = useApi({
    method: "put",
    url: `product/${id}`,
  });
  const detailProductRequest = useApi({
    method: "get",
    url: `product/${id}`,
  });
  const getProductCategoryRequest = useApi({
    method: "get",
    url: `product/category`,
  });

  const onSubmitAmount = (data) => {
    if (data.isUpdate) {
      const index = amounts.findIndex((item) => item.id === data.id);
      const amountTmp = [...amounts];
      amountTmp[index] = data;
      setAmounts(amountTmp);
    } else {
      setAmounts([...amounts, data]);
    }
    onDismissAmount();
  };

  const onDismissAmount = () => {
    DialogActions.hide({ name: "amount" });
  };

  const onShowDialog = (data) => {
    let units;
    const allUnits = unitAction
      .getProductUnit()
      .filter((item) => item.value === selectedUnit)[0];
    if (allUnits) {
      units = allUnits.children;
    }
    DialogActions.show({
      title: "موجودی اول دوره",
      component: (
        <Amount
          onSubmit={onSubmitAmount}
          onDismiss={onDismissAmount}
          defaultValues={data}
          units={units}
        />
      ),
      name: "amount",
      size: "4",
      confirm: false,
      disableCloseButton: true,
    });
  };

  const onAddAmount = () => {
    onShowDialog();
  };

  const filterAmounts = (amounts) => {
    const filteredAmount = [];
    amounts.map((item) => {
      const newObject = {
        stock: item.stock,
        depotId: item.depot.value,
        unit: item.unit.value,
        perunit: item.perUnit,
      };
      filteredAmount.push(newObject);
    });
    return filteredAmount;
  };

  const onSubmit = async (data) => {
    const result = {
      ...data,
      categories: selectedCategory,
      unitBase: selectedUnit,
      stocks: id ? amounts : filterAmounts(amounts),
    };
    if (id) {
      return await editProductRequest.execute(result);
    }
    await addProductRequest.execute(result);
    setTimeout(() => {
      onReject();
    }, 1000);
  };

  const onReject = () => {
    history.push("/app/product-list");
  };

  const getDetail = async () => {
    const detail = await detailProductRequest.execute();
    setDetail(detail.data);
    setSelectedCategory(detail.data.categories);
    setSelectedUnit(detail.data.unitBase);
    setAmounts(detail.data.stocks);
  };

  const handleEditAmount = (data) => {
    onShowDialog(data);
  };

  const handleDeleteAmount = (id) => {
    DialogActions.show({
      confirm: true,
      title: "ایا از حذف این رکورد مطمئن هستید ؟",
      onAction: () => {
        setAmounts(amounts.filter((item) => item.id !== id));
        DialogActions.hide({ name: "delete" });
      },
      name: "delete",
      size: "6",
      disableCloseButton: false,
    });
  };

  const getProductCategory = async () => {
    const result = await getProductCategoryRequest.execute();
    setCategory(result.data);
  };

  const onChangeUnit = (e) => {
    setSelectedUnit(e.target.value);
  };

  const onChangeCategory = (e) => {
    setSelectedCategory(e.target.value);
  };

  useEffect(() => {
    getProductCategory();
    if (id) {
      getDetail();
    }
  }, []);

  useEffect(() => {
    reset(detail);
  }, [reset, detail]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {!detailProductRequest.pending ? (
        <Grid item lg={6} sm={12} className={classes.root}>
          <Paper className={classes.paper}>
            <Typography
              className={classes.title}
              variant="h6"
              id="tableTitle"
              component="div"
            >
              {id ? "ویرایش کالا" : "افزودن کالا"}
            </Typography>

            <Grid container spacing={3} alignItems="center">
              <Fragment>
                <Grid item lg={6} xs={12} className={classes.datePicker}>
                  <Controller
                    control={control}
                    render={({ onChange, value, name }) => {
                      return (
                        <TextField
                          variant="outlined"
                          label="نام "
                          name={name}
                          onChange={onChange}
                          value={value}
                          error={!!errors.name}
                          helperText={errors.name ? errors.name.message : ""}
                          fullWidth
                          size="small"
                        />
                      );
                    }}
                    rules={{ required: Constant.VALIDATION.REQUIRED }}
                    name="name"
                  />
                </Grid>
                <Grid item lg={6} xs={12}>
                  <TextField
                    disabled={id}
                    select
                    label="واحد شمارش"
                    value={selectedUnit}
                    onChange={onChangeUnit}
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
                  <FormControl
                    size="small"
                    variant="outlined"
                    className={classes.formControl}
                  >
                    <InputLabel htmlFor="outlined-age-native-simple">
                      دسته بندی
                    </InputLabel>
                    <Select
                      multiple
                      label="  دسته بندی"
                      inputProps={{
                        name: "age",
                        id: "outlined-age-native-simple",
                      }}
                      value={selectedCategory}
                      onChange={onChangeCategory}
                    >
                      {category.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item lg={6} xs={12}>
                  <Button
                    disabled={isEmpty(selectedUnit)}
                    variant="contained"
                    color="primary"
                    onClick={onAddAmount}
                  >
                    افزودن موجودی اول دوره
                  </Button>
                </Grid>
                {!!amounts.length && (
                  <Grid item xs={12}>
                    <Paper>
                      <TableContainer style={{ padding: "0 10px" }}>
                        <Table
                          className={classes.table}
                          size={"medium"}
                          style={{ paddingRight: 10 }}
                        >
                          <TableHeader headCells={headCells} />

                          <TableBody>
                            {amounts.map((row) => {
                              return (
                                <TableRow
                                  hover
                                  tabIndex={-1}
                                  key={row.id}
                                  style={{ paddingRight: 10 }}
                                >
                                  <TableCell padding="none">
                                    {row.perUnit
                                      ? `${persianNumber(
                                          row.stock,
                                        )}*${persianNumber(row.perUnit)}`
                                      : persianNumber(row.stock)}
                                  </TableCell>

                                  <TableCell padding="none">
                                    {row.unit.label}
                                  </TableCell>

                                  <TableCell padding="none">
                                    {row.depot.label}
                                  </TableCell>
                                  <TableCell
                                    padding="none"
                                    style={{ textAlign: "left" }}
                                  >
                                    <IconButton
                                      onClick={() => handleEditAmount(row)}
                                    >
                                      <EditIcon />
                                    </IconButton>

                                    <IconButton
                                      onClick={() => handleDeleteAmount(row.id)}
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Paper>
                  </Grid>
                )}
                <Grid
                  item
                  xs={12}
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Button variant="contained" color="primary" type="submit">
                    تایید
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={onReject}
                  >
                    بازگشت
                  </Button>
                </Grid>
              </Fragment>
            </Grid>
          </Paper>
        </Grid>
      ) : (
        <CircularProgress />
      )}
    </form>
  );
}
