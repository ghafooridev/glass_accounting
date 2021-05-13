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
} from "@material-ui/core";
import TableHeader from "../../components/Table/TableHead";
import { DeleteIcon, EditIcon } from "../../components/icons";
import { useForm, Controller } from "react-hook-form";
import { useApi } from "../../hooks/useApi";
import Constant from "../../helpers/constant";
import { getQueryString } from "../../helpers/utils";
import CircularProgress from "../../components/CircularProgress";
import DialogActions from "../../redux/actions/dialogAction";
import Amount from "./amount";
import unitAction from "../../redux/actions/unitAction";

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
  const [selectedCategory, setSelectedCategory] = useState(1);
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
    setAmounts([...amounts, data]);
    DialogActions.hide();
  };

  const onDismissAmount = () => {
    DialogActions.hide();
  };

  const onShowDialog = (data) => {
    const units = unitAction
      .getProductUnit()
      .filter((item) => item.value === selectedUnit)[0].children;
    DialogActions.show({
      title: " حساب بانکی",
      component: (
        <Amount
          onSubmit={onSubmitAmount}
          onDismiss={onDismissAmount}
          defaultValues={data}
          units={units}
        />
      ),
      size: "xs",
      disableCloseButton: true,
    });
  };

  const onAddAmount = () => {
    onShowDialog();
  };

  const onSubmit = async (data) => {
    const result = {
      ...data,
      category: selectedCategory,
      baseUnit: selectedUnit,
    };
    if (id) {
      return await editProductRequest.execute(result);
    }
    await addProductRequest.execute(result);
  };

  const onReject = () => {
    history.push("/app/product-list");
  };

  const getDetail = async () => {
    const detail = await detailProductRequest.execute();
    setDetail(detail.data);
  };

  const handleEditAmount = (data) => {
    console.log(data);
    onShowDialog(data);
  };

  const handleDeleteAmount = (id) => {
    DialogActions.show({
      confirm: true,
      title: "ایا از حذف این رکورد مطمئن هستید ؟",
      onAction: async () => {
        setAmounts(amounts.filter((item) => item.id !== id));
        DialogActions.hide();
      },
      size: "sm",
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
                    select
                    label="واحد شمارش"
                    value={selectedUnit}
                    onChange={onChangeUnit}
                    variant="outlined"
                    name="baseUnit"
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
                    select
                    label="دسته بندی"
                    value={selectedCategory}
                    onChange={onChangeCategory}
                    variant="outlined"
                    name="category"
                    error={!!errors.category}
                    helperText={errors.category ? errors.category.message : ""}
                    fullWidth
                    size="small"
                  >
                    {category.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item lg={6} xs={12}>
                  <Button
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
                                    {row.bank}
                                  </TableCell>
                                  <TableCell padding="none">
                                    {row.cardNumber}
                                  </TableCell>
                                  <TableCell padding="none">
                                    {row.accountNumber}
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
