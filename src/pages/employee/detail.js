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
  RadioGroup,
  Radio,
  FormControlLabel,
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
import { DatePicker } from "@material-ui/pickers";
import moment from "moment";

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
  datePicker: {
    "& input": {
      padding: "10px 14px",
    },
  },
  rootSelect: {
    display: "flex",
    alignItems: "center",
    paddingBottom: 7,
    paddingTop: 7,
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
  const [selectedGender, setSelectedGender] = useState("M");
  const [selectedContract, setSelectedContract] = useState("DAILY");
  const [selectedDate, setSelectedDate] = useState(moment());
  const { control, handleSubmit, errors, reset } = useForm();

  const addEmployeeRequest = useApi({
    method: "post",
    url: `employee`,
  });

  const editEmployeeRequest = useApi({
    method: "put",
    url: `employee/${id}`,
  });

  const detailEmployeeRequest = useApi({
    method: "get",
    url: `employee/${id}`,
  });

  const deleteAccountRequest = useApi({
    method: "delete",
    url: `account`,
  });

  const onSubmit = async (data) => {
    const contract = {
      type: selectedContract,
      SPH: data.SPH,
      startDate: selectedDate._d,
    };
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
      contract,
      gender: selectedGender,
    };
    if (id) {
      return await editEmployeeRequest.execute(allData);
    }
    await addEmployeeRequest.execute(allData);
  };

  const onReject = () => {
    history.push("/app/employee-list");
  };

  const getDetail = async () => {
    const detail = await detailEmployeeRequest.execute();
    setDetail(detail.data);
    setAccounts(detail.data.accounts);
    setSelectedGender(detail.data.gender);
    setSelectedContract(detail.data.contract.type);
    setSelectedDate(detail.data.contract.startDate);
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

  const handleDeleteAccount = (id) => {
    DialogActions.show({
      confirm: true,
      title: "ایا از حذف این رکورد مطمئن هستید ؟",
      onAction: async () => {
        await deleteAccountRequest.execute(null, id);
        setAccounts(accounts.filter((item) => item.id !== id));
        DialogActions.hide();
      },
      size: "sm",
      disableCloseButton: false,
    });
  };

  const handleChangeGender = (e) => {
    setSelectedGender(e.target.value);
  };

  const onChangeContract = (e) => {
    setSelectedContract(e.target.value);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  useEffect(() => {
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
        {!detailEmployeeRequest.pending ? (
          <Grid item lg={6} sm={12} className={classes.root}>
            <Paper className={classes.paper}>
              <Typography
                className={classes.title}
                variant="h6"
                id="tableTitle"
                component="div"
              >
                {id ? "ویرایش پرسنل" : "افزودن پرسنل"}
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
                    <RadioGroup
                      aria-label="gender"
                      name="gender1"
                      value={selectedGender}
                      onChange={handleChangeGender}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-around",
                      }}
                    >
                      <FormControlLabel
                        value="M"
                        control={<Radio />}
                        label="مرد"
                      />
                      <FormControlLabel
                        value="F"
                        control={<Radio />}
                        label="زن"
                      />
                    </RadioGroup>
                  </Grid>

                  <Grid item lg={6} xs={12}>
                    <TextField
                      select
                      label="نوع قرارداد"
                      value={selectedContract}
                      onChange={onChangeContract}
                      variant="outlined"
                      fullWidth
                      size="small"
                    >
                      {Constant.EMPLOYEE_CONTACRT.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item lg={6} xs={12}>
                    <Controller
                      control={control}
                      render={({ onChange, value, name }) => {
                        return (
                          <TextField
                            type="number"
                            variant="outlined"
                            label="مبلغ قرارداد"
                            name={name}
                            onChange={onChange}
                            value={value}
                            error={!!errors.SPH}
                            helperText={errors.SPH ? errors.SPH.message : ""}
                            fullWidth
                            size="small"
                          />
                        );
                      }}
                      rules={{ required: Constant.VALIDATION.REQUIRED }}
                      name="SPH"
                    />
                  </Grid>
                  <Grid item lg={6} xs={12} className={classes.datePicker}>
                    <DatePicker
                      autoOk
                      name="date"
                      label="تاریخ شروع قرارداد"
                      inputVariant="outlined"
                      okLabel="تأیید"
                      cancelLabel="لغو"
                      labelFunc={(date) =>
                        date ? date.format("jYYYY/jMM/jDD") : ""
                      }
                      value={selectedDate}
                      onChange={handleDateChange}
                      style={{ width: "100%" }}
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
                                        {row.bank.label || row.bank.name}
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
                                        onClick={() =>
                                          handleDeleteAccount(row.id)
                                        }
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
