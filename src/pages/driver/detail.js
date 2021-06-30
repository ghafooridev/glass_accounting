import React, { Fragment, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableContainer,
  TableCell,
  TableRow,
  IconButton,
  MenuItem,
} from "@material-ui/core";
import TableHeader from "../../components/Table/TableHead";
import { DeleteIcon, EditIcon } from "../../components/icons";
import { useForm, Controller } from "react-hook-form";
import { useApi } from "../../hooks/useApi";
import Constant from "../../helpers/constant";
import { getQueryString } from "../../helpers/utils";
import DialogActions from "../../redux/actions/dialogAction";
import Account from "./account";
import CircularProgress from "../../components/CircularProgress";

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
}));

const headCells = [
  {
    id: "Name",
    label: "نام بانک",
  },
  { id: "accountNumber", label: "شماره حساب " },
  {
    id: "CardNumber",
    label: "شماره کارت",
  },

  { id: "action" },
];

export default function MainDetail() {
  const classes = useStyles();
  const history = useHistory();
  const id = getQueryString("id");
  const [detail, setDetail] = useState({});
  const [accounts, setAccounts] = useState([]);
  const [category, setCategory] = useState([]);
  const [driverCategory, setDriverCategory] = useState(1);
  const { control, handleSubmit, errors, reset } = useForm();

  const addDriverRequest = useApi({
    method: "post",
    url: `driver`,
  });
  const editDriverRequest = useApi({
    method: "put",
    url: `driver/${id}`,
  });
  const detailDriverRequest = useApi({
    method: "get",
    url: `driver/${id}`,
  });

  const driverCategoryRequest = useApi({
    method: "get",
    url: `driver/category`,
  });

  const deleteAccountRequest = useApi({
    method: "delete",
    url: `account`,
  });

  const onSubmit = async (data) => {
    const newAccounts = [];
    accounts.map((item) => {
      const newData = {
        bankId: item.bank.value,
        accountCardNumber: item.accountCardNumber,
        accountNumber: item.accountNumber,
        accountShaba: item.accountShaba,
        description: item.description,
      };
      newAccounts.push(newData);
    });

    const allData = {
      ...data,
      accounts: newAccounts,
      categoryId: driverCategory,
    };
    if (id) {
      return await editDriverRequest.execute(allData);
    }
    await addDriverRequest.execute(allData);
  };

  const onReject = () => {
    history.push("/app/driver-list");
  };

  const getDetail = async () => {
    const detail = await detailDriverRequest.execute();
    setDetail(detail.data);
    setDriverCategory(detail.data.driverCategory);
    setAccounts(detail.data?.accounts || []);
  };

  const getDriverCategory = async () => {
    const detail = await driverCategoryRequest.execute();
    setCategory(detail.data);
  };

  const onSubmitAccount = (data) => {
    if (data.isUpdate) {
      const index = accounts.findIndex((item) => item.id === data.id);
      const accounstTmp = [...accounts];
      accounstTmp[index] = data;
      setAccounts(accounstTmp);
    } else {
      setAccounts([...accounts, data]);
    }
    DialogActions.hide();
  };

  const onDismissAccount = () => {
    DialogActions.hide();
  };

  const onShowDialog = (data) => {
    DialogActions.show({
      title: " حساب بانکی",
      component: (
        <Account
          onSubmit={onSubmitAccount}
          onDismiss={onDismissAccount}
          defaultValues={data}
        />
      ),
      size: "xs",
      confirm: false,
      disableCloseButton: true,
    });
  };

  const onAddAccount = () => {
    onShowDialog();
  };

  const handleEditAccount = (data) => {
    onShowDialog(data);
  };

  const handleDeleteAccount = (row) => {
    DialogActions.show({
      confirm: true,
      title: "ایا از حذف این رکورد مطمئن هستید ؟",
      onAction: async () => {
        if (id) {
          await deleteAccountRequest.execute(null, row.id);
        }
        setAccounts(accounts.filter((item) => item.id !== row.id));
        DialogActions.hide();
      },
      size: "sm",
      disableCloseButton: false,
    });
  };

  const onChangeCategory = (e) => {
    setDriverCategory(e.target.value);
  };

  useEffect(() => {
    getDriverCategory();
    if (id) {
      getDetail();
    }
  }, []);

  useEffect(() => {
    reset(detail);
  }, [reset, detail]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {!detailDriverRequest.pending ? (
          <Grid item lg={6} sm={12} className={classes.root}>
            <Paper className={classes.paper}>
              <Typography
                className={classes.title}
                variant="h6"
                id="tableTitle"
                component="div"
              >
                {id ? "ویرایش راننده" : "افزودن راننده"}
              </Typography>

              <Grid container spacing={3}>
                <Fragment>
                  <Grid item lg={6} xs={12}>
                    <Controller
                      control={control}
                      render={({ onChange, value, name }) => {
                        return (
                          <TextField
                            variant="outlined"
                            label="نام"
                            name={name}
                            onChange={onChange}
                            value={value}
                            error={!!errors.firstName}
                            helperText={
                              errors.firstName ? errors.firstName.message : ""
                            }
                            fullWidth
                            size="small"
                          />
                        );
                      }}
                      rules={{ required: Constant.VALIDATION.REQUIRED }}
                      name="firstName"
                    />
                  </Grid>
                  <Grid item lg={6} xs={12}>
                    <Controller
                      control={control}
                      render={({ onChange, value, name }) => {
                        return (
                          <TextField
                            variant="outlined"
                            label="نام خانوادگی"
                            name={name}
                            onChange={onChange}
                            value={value}
                            error={!!errors.lastName}
                            helperText={
                              errors.lastName ? errors.lastName.message : ""
                            }
                            fullWidth
                            size="small"
                          />
                        );
                      }}
                      rules={{ required: Constant.VALIDATION.REQUIRED }}
                      name="lastName"
                    />
                  </Grid>
                  <Grid item lg={6} xs={12}>
                    <Controller
                      control={control}
                      render={({ onChange, value, name }) => {
                        return (
                          <TextField
                            variant="outlined"
                            label="تلفن"
                            name={name}
                            onChange={onChange}
                            value={value}
                            error={!!errors.phone}
                            helperText={
                              errors.phone ? errors.phone.message : ""
                            }
                            fullWidth
                            size="small"
                          />
                        );
                      }}
                      name="phone"
                    />
                  </Grid>
                  <Grid item lg={6} xs={12}>
                    <Controller
                      control={control}
                      render={({ onChange, value, name }) => {
                        return (
                          <TextField
                            variant="outlined"
                            label="موبایل"
                            name={name}
                            onChange={onChange}
                            value={value}
                            error={!!errors.mobile}
                            helperText={
                              errors.mobile ? errors.mobile.message : ""
                            }
                            fullWidth
                            size="small"
                          />
                        );
                      }}
                      rules={{
                        minLength: {
                          value: 11,
                          message: Constant.VALIDATION.MOBILE_NUMBER,
                        },
                        maxLength: {
                          value: 11,
                          message: Constant.VALIDATION.MOBILE_NUMBER,
                        },
                      }}
                      name="mobile"
                    />
                  </Grid>
                  <Grid item lg={6} xs={12}>
                    <Controller
                      control={control}
                      render={({ onChange, value, name }) => {
                        return (
                          <TextField
                            type="number"
                            variant="outlined"
                            label="مانده از قبل"
                            name={name}
                            onChange={onChange}
                            value={value}
                            error={!!errors.accountRemaining}
                            helperText={
                              errors.accountRemaining
                                ? errors.accountRemaining.message
                                : ""
                            }
                            fullWidth
                            size="small"
                          />
                        );
                      }}
                      name="accountRemaining"
                    />
                  </Grid>
                  <Grid item lg={6} xs={12}>
                    {!!category.length && driverCategory && (
                      <TextField
                        select
                        label="دسته بندی"
                        value={driverCategory}
                        onChange={onChangeCategory}
                        variant="outlined"
                        error={!!errors.driverCategory}
                        helperText={
                          errors.driverCategory
                            ? errors.driverCategory.message
                            : ""
                        }
                        fullWidth
                        size="small"
                      >
                        {category.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  </Grid>
                  <Grid item lg={6} xs={12}>
                    <Controller
                      control={control}
                      render={({ onChange, value, name }) => {
                        return (
                          <TextField
                            variant="outlined"
                            label="نام خودرو"
                            name={name}
                            onChange={onChange}
                            value={value}
                            error={!!errors.carName}
                            helperText={
                              errors.carName ? errors.carName.message : ""
                            }
                            fullWidth
                            size="small"
                          />
                        );
                      }}
                      name="carName"
                    />
                  </Grid>
                  <Grid item lg={6} xs={12}>
                    <Controller
                      control={control}
                      render={({ onChange, value, name }) => {
                        return (
                          <TextField
                            variant="outlined"
                            label="پلاک خودرو"
                            name={name}
                            onChange={onChange}
                            value={value}
                            error={!!errors.carPlaque}
                            helperText={
                              errors.carPlaque ? errors.carPlaque.message : ""
                            }
                            fullWidth
                            size="small"
                          />
                        );
                      }}
                      name="carPlaque"
                    />
                  </Grid>
                  <Grid item lg={6} xs={12}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={onAddAccount}
                    >
                      افزودن حساب بانکی
                    </Button>
                  </Grid>
                  {!!accounts.length && (
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
                              {accounts.map((row) => {
                                return (
                                  <TableRow
                                    hover
                                    tabIndex={-1}
                                    key={row.id}
                                    style={{ paddingRight: 10 }}
                                  >
                                    <TableCell padding="none">
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        <img
                                          src={`${Constant.API_ADDRESS}/${row.bank.logo}`}
                                          alt={row.bank.label}
                                          style={{
                                            width: 25,
                                            height: 25,
                                            borderRadius: "50%",
                                            marginLeft: 5,
                                          }}
                                        />
                                        {row.bank.name || row.bank.label}
                                      </div>
                                    </TableCell>
                                    <TableCell padding="none">
                                      {row.accountNumber}
                                    </TableCell>
                                    <TableCell padding="none">
                                      {row.accountCardNumber}
                                    </TableCell>

                                    <TableCell
                                      padding="none"
                                      style={{ textAlign: "left" }}
                                    >
                                      <IconButton
                                        onClick={() => handleEditAccount(row)}
                                      >
                                        <EditIcon />
                                      </IconButton>

                                      <IconButton
                                        onClick={() => handleDeleteAccount(row)}
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

                  <Grid item xs={12}>
                    <Controller
                      control={control}
                      render={({ onChange, value, name }) => {
                        return (
                          <TextField
                            variant="outlined"
                            label="آدرس"
                            name={name}
                            onChange={onChange}
                            value={value}
                            error={!!errors.address}
                            helperText={
                              errors.address ? errors.address.message : ""
                            }
                            fullWidth
                            size="small"
                          />
                        );
                      }}
                      name="address"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      control={control}
                      render={({ onChange, value, name }) => {
                        return (
                          <TextField
                            label="توضیحات"
                            multiline
                            rows={4}
                            variant="outlined"
                            name={name}
                            onChange={onChange}
                            value={value}
                            fullWidth
                            error={!!errors.description}
                            helperText={
                              errors.description
                                ? errors.description.message
                                : ""
                            }
                          />
                        );
                      }}
                      name="description"
                    />
                  </Grid>

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
    </>
  );
}
