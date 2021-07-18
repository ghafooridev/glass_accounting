import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableContainer,
  TableCell,
  TableRow,
  Paper,
  Typography,
  Grid,
  TextField,
  Chip,
} from "@material-ui/core";
import { TimePicker } from "@material-ui/pickers";
import { useApi } from "../../hooks/useApi";
import {
  getQueryString,
  hasPermission,
  persianNumber,
} from "../../helpers/utils";
import TableHeader from "../../components/Table/TableHead";
import { convertParamsToQueryString } from "../../helpers/utils";
import { DatePicker } from "@material-ui/pickers";
import moment from "moment";
import clsx from "clsx";
import Constant from "../../helpers/constant";
import AlertAction from "../../redux/actions/AlertAction";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "0 auto",
  },
  paper: {
    width: "100%",
    padding: 20,
    marginBottom: 10,
  },
  title: {
    paddingBottom: 20,
  },
  datePicker: {
    "& input": {
      padding: "10px 14px",
    },
  },
  enter: {
    color: "#fff",
    backgroundColor: theme.palette.primary.main,
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
    },
  },
  exit: {
    color: "#fff",
    backgroundColor: theme.palette.error.main,
    "&:hover": {
      backgroundColor: theme.palette.error.main,
    },
  },
  logedEnter: {
    color: "white",
    fontSize: 16,
    backgroundColor: theme.palette.gray.main,
    "&:hover": {
      backgroundColor: theme.palette.gray.main,
    },
  },
  logedExit: {
    color: "white",
    fontSize: 16,
    backgroundColor: theme.palette.gray.main,
    "&:hover": {
      backgroundColor: theme.palette.gray.main,
    },
  },
  register: {
    color: "#fff",
    backgroundColor: theme.palette.success.main,
    "&:hover": {
      backgroundColor: theme.palette.success.dark,
    },
  },
  dateTime: {
    display: "flex",
    flexDirection: "column",
  },
  clockConatiner: {
    background: theme.palette.primary.main,
    justifyContent: "flex-end",
    alignItems: "center",
    display: "flex",
  },
}));

const headCells = [
  {
    id: "name",
    label: "نام و نام خانوادگی",
  },

  { id: "enter", label: "ورود" },
  {
    id: "exit",
    label: "خروج",
  },
  { id: "enter", label: "ورود" },
  {
    id: "exit",
    label: "خروج",
  },
];

export default function MainDetail() {
  const classes = useStyles();
  const history = useHistory();
  const [search, setSearch] = useState();
  const [list, setList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(moment());
  const [selectedTime, setSelectedTime] = useState(moment());
  const [isEditTime, setIsEditTime] = useState(false);
  const [editTime, setEditTime] = useState();

  const registerRequest = useApi({
    method: "post",
    url: `attendance`,
  });

  const getTrafficRequest = useApi({
    method: "get",
    url: decodeURIComponent(
      `attendance?${convertParamsToQueryString({
        search,
        filter: `{date:${selectedDate._d.toISOString()}}`,
      })}`,
    ),
  });

  const editTrafficRequest = useApi({
    method: "put",
    url: `attendance`,
  });

  const onSubmit = async (row, type) => {
    if (hasPermission(Constant.ALL_PERMISSIONS.ATTENDANCE_EDIT)) {
      if (!checkToday()) {
        await registerRequest.execute({ employeeId: row.id, type });
        getData();
      }
    } else {
      AlertAction.show({
        type: "error",
        text: Constant.MESSAGES.ERROR_MESSAGE.ACCESS_DENIED,
      });
    }
  };

  const onEdit = async (date) => {
    if (hasPermission(Constant.ALL_PERMISSIONS.ATTENDANCE_EDIT)) {
      const tzOffset = new Date().getTimezoneOffset() * 60000;
      await editTrafficRequest.execute({
        id: editTime.id,
        date: new Date(new Date(date) - tzOffset),
      });
      getData();
    } else {
      AlertAction.show({
        type: "error",
        text: Constant.MESSAGES.ERROR_MESSAGE.ACCESS_DENIED,
      });
    }
  };

  const onChangeSearch = (e) => {
    setSearch(e.target.value);
  };

  const getData = async () => {
    const userList = await getTrafficRequest.execute();
    setList(userList.data);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleTimeChange = (date) => {
    setSelectedTime(date._d);
    setIsEditTime(false);
    setEditTime(null);
    onEdit(date._d);
  };

  const onEditTime = (time) => {
    setSelectedTime(time.dateTime);
    setIsEditTime(true);
    setEditTime({ id: time.id });
  };

  const checkToday = () => {
    return selectedDate._d.toDateString() !== moment()._d.toDateString();
  };

  const getTimesElement = (row) => {
    if (row.times.length === 0) {
      return (
        <>
          <TableCell padding="none">
            <Chip
              label={"ثبت ورود"}
              className={clsx(
                classes.enter,
                checkToday() && classes.logedEnter,
              )}
              onClick={() => onSubmit(row, "ENTER")}
            />
          </TableCell>
          <TableCell padding="none"></TableCell>
          <TableCell padding="none"></TableCell>
          <TableCell padding="none"></TableCell>
        </>
      );
    }
    if (row.times.length === 1) {
      return (
        <>
          <TableCell padding="none">
            {isEditTime && row.times[0].id === editTime.id ? (
              <TimePicker
                style={{ width: 50 }}
                ampm={false}
                value={selectedTime}
                onChange={handleTimeChange}
                okLabel="تایید"
                cancelLabel="انصراف"
              />
            ) : (
              <Chip
                label={persianNumber(row.times[0].time).substring(0, 5)}
                className={classes.logedEnter}
                onClick={() => onEditTime(row.times[0])}
              />
            )}
          </TableCell>
          <TableCell padding="none">
            <Chip
              label={"ثبت خروج"}
              className={clsx(classes.exit, checkToday() && classes.logedExit)}
              onClick={() => onSubmit(row, "EXIT")}
            />
          </TableCell>
          <TableCell padding="none"></TableCell>
          <TableCell padding="none"></TableCell>
        </>
      );
    }
    if (row.times.length === 2) {
      return (
        <>
          <TableCell padding="none">
            {isEditTime && row.times[0].id === editTime.id ? (
              <TimePicker
                style={{ width: 50 }}
                ampm={false}
                value={selectedTime}
                onChange={handleTimeChange}
                okLabel="تایید"
                cancelLabel="انصراف"
              />
            ) : (
              <Chip
                label={persianNumber(row.times[0].time).substring(0, 5)}
                className={classes.logedEnter}
                onClick={() => onEditTime(row.times[0])}
              />
            )}
          </TableCell>
          <TableCell padding="none">
            {isEditTime && row.times[1].id === editTime.id ? (
              <TimePicker
                style={{ width: 50 }}
                ampm={false}
                value={selectedTime}
                onChange={handleTimeChange}
                okLabel="تایید"
                cancelLabel="انصراف"
              />
            ) : (
              <Chip
                label={persianNumber(row.times[1].time).substring(0, 5)}
                className={classes.logedExit}
                onClick={() => onEditTime(row.times[1])}
              />
            )}
          </TableCell>
          <TableCell padding="none">
            <Chip
              label={"ثبت ورود"}
              className={clsx(
                classes.enter,
                checkToday() && classes.logedEnter,
              )}
              onClick={() => onSubmit(row, "ENTER")}
            />
          </TableCell>
          <TableCell padding="none"></TableCell>
        </>
      );
    }
    if (row.times.length === 3) {
      return (
        <>
          <TableCell padding="none">
            {isEditTime && row.times[0].id === editTime.id ? (
              <TimePicker
                style={{ width: 50 }}
                ampm={false}
                value={selectedTime}
                onChange={handleTimeChange}
                okLabel="تایید"
                cancelLabel="انصراف"
              />
            ) : (
              <Chip
                label={persianNumber(row.times[0].time).substring(0, 5)}
                className={classes.logedEnter}
                onClick={() => onEditTime(row.times[0])}
              />
            )}
          </TableCell>
          <TableCell padding="none">
            {isEditTime && row.times[1].id === editTime.id ? (
              <TimePicker
                style={{ width: 50 }}
                ampm={false}
                value={selectedTime}
                onChange={handleTimeChange}
                okLabel="تایید"
                cancelLabel="انصراف"
              />
            ) : (
              <Chip
                label={persianNumber(row.times[1].time).substring(0, 5)}
                className={classes.logedExit}
                onClick={() => onEditTime(row.times[1])}
              />
            )}
          </TableCell>
          <TableCell padding="none">
            {isEditTime && row.times[2].id === editTime.id ? (
              <TimePicker
                style={{ width: 50 }}
                ampm={false}
                value={selectedTime}
                onChange={handleTimeChange}
                okLabel="تایید"
                cancelLabel="انصراف"
              />
            ) : (
              <Chip
                label={persianNumber(row.times[2].time).substring(0, 5)}
                className={classes.logedEnter}
                onClick={() => onEditTime(row.times[2])}
              />
            )}
          </TableCell>
          <TableCell padding="none">
            <Chip
              label={"ثبت خروج"}
              className={clsx(classes.exit, checkToday() && classes.logedExit)}
              onClick={() => onSubmit(row, "EXIT")}
            />
          </TableCell>
        </>
      );
    }
    if (row.times.length === 4) {
      return (
        <>
          <TableCell padding="none">
            {isEditTime && row.times[0].id === editTime.id ? (
              <TimePicker
                style={{ width: 50 }}
                ampm={false}
                value={selectedTime}
                onChange={handleTimeChange}
                okLabel="تایید"
                cancelLabel="انصراف"
              />
            ) : (
              <Chip
                label={persianNumber(row.times[0].time).substring(0, 5)}
                className={classes.logedEnter}
                onClick={() => onEditTime(row.times[0])}
              />
            )}
          </TableCell>
          <TableCell padding="none">
            {isEditTime && row.times[1].id === editTime.id ? (
              <TimePicker
                style={{ width: 50 }}
                ampm={false}
                value={selectedTime}
                onChange={handleTimeChange}
                okLabel="تایید"
                cancelLabel="انصراف"
              />
            ) : (
              <Chip
                label={persianNumber(row.times[1].time).substring(0, 5)}
                className={classes.logedExit}
                onClick={() => onEditTime(row.times[1])}
              />
            )}
          </TableCell>
          <TableCell padding="none">
            {isEditTime && row.times[2].id === editTime.id ? (
              <TimePicker
                style={{ width: 50 }}
                ampm={false}
                value={selectedTime}
                onChange={handleTimeChange}
                okLabel="تایید"
                cancelLabel="انصراف"
              />
            ) : (
              <Chip
                label={persianNumber(row.times[2].time).substring(0, 5)}
                className={classes.logedEnter}
                onClick={() => onEditTime(row.times[2])}
              />
            )}
          </TableCell>
          <TableCell padding="none">
            {isEditTime && row.times[3].id === editTime.id ? (
              <TimePicker
                style={{ width: 50 }}
                ampm={false}
                value={selectedTime}
                onChange={handleTimeChange}
                okLabel="تایید"
                cancelLabel="انصراف"
              />
            ) : (
              <Chip
                label={persianNumber(row.times[3].time).substring(0, 5)}
                className={classes.logedExit}
                onClick={() => onEditTime(row.times[3])}
              />
            )}
          </TableCell>
        </>
      );
    }
  };

  // useEffect(() => {
  //   console.log(new Date(selectedTime._d).getHours());
  // }, [selectedTime]);

  useEffect(() => {
    getData();
  }, [search, selectedDate]);

  return (
    <>
      {hasPermission(Constant.ALL_PERMISSIONS.ATTENDANCE_LIST) && (
        <Grid container spacing={3} style={{ alignItems: "baseline" }}>
          <Grid item lg={3} sm={12} className={classes.dateTime}>
            <DatePicker
              autoOk
              orientation="portrait"
              variant="static"
              openTo="date"
              name="date"
              label="تاریخ شروع قرارداد"
              inputVariant="outlined"
              okLabel="تأیید"
              cancelLabel="لغو"
              labelFunc={(date) => (date ? date.format("jYYYY/jMM/jDD") : "")}
              value={selectedDate}
              onChange={handleDateChange}
              style={{ width: "100%" }}
            />

            {/* {isEditTime && (
          <TimePicker
            autoOk={false}
            variant="static"
            openTo="hours"
            ampm={false}
            value={selectedTime}
            onChange={setSelectedTime}
          />
        )} */}
          </Grid>
          <Grid item lg={8} sm={12} className={classes.root}>
            <Paper className={classes.paper}>
              <Typography
                className={classes.title}
                variant="h6"
                id="tableTitle"
                component="div"
              >
                ثبت حضور و غیاب
              </Typography>

              <Grid container spacing={3}>
                <Grid item lg={12} xs={12}>
                  <TextField
                    variant="outlined"
                    label=" جستجوی پرسنل"
                    onChange={onChangeSearch}
                    value={search}
                    fullWidth
                    size="small"
                  />
                </Grid>
              </Grid>
            </Paper>
            <div className={classes.root}>
              <Paper className={classes.paper}>
                <TableContainer style={{ padding: "0 10px" }}>
                  <Table
                    className={classes.table}
                    size={"medium"}
                    style={{ paddingRight: 10 }}
                  >
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
                            <TableCell padding="none">{row.employee}</TableCell>
                            {getTimesElement(row)}
                          </TableRow>
                        );
                      })}
                      {!list.length && !getTrafficRequest.pending && (
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
              </Paper>
            </div>
          </Grid>
        </Grid>
      )}
    </>
  );
}
