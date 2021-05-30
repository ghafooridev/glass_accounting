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
import { useApi } from "../../hooks/useApi";
import { getQueryString } from "../../helpers/utils";
import TableHeader from "../../components/Table/TableHead";
import { convertParamsToQueryString } from "../../helpers/utils";

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
  enter: {
    color: "#fff",
    backgroundColor: theme.palette.primary.main,
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  exit: {
    color: "#fff",
    backgroundColor: theme.palette.error.main,
    "&:hover": {
      backgroundColor: theme.palette.error.dark,
    },
  },
  register: {
    color: "#fff",
    backgroundColor: theme.palette.success.main,
    "&:hover": {
      backgroundColor: theme.palette.success.dark,
    },
  },
}));

const headCells = [
  {
    id: "firstName",
    label: "نام",
  },
  {
    id: "lastName",
    label: "نام خانوادگی",
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
  const id = getQueryString("id");
  const [search, setSearch] = useState();
  const [list, setList] = useState([]);

  const addUserRequest = useApi({
    method: "post",
    url: `user`,
  });
  const editUserRequest = useApi({
    method: "put",
    url: `user/${id}`,
  });

  const getUserRequest = useApi({
    method: "get",
    url: `user?${convertParamsToQueryString({
      search,
    })}`,
  });

  const onSubmit = async (data) => {
    if (id) {
      await editUserRequest.execute(data);
    } else {
      await addUserRequest.execute(data);
    }
  };

  const onChangeSearch = (e) => {
    setSearch(e.target.value);
  };

  const onEnter = (row) => {
    console.log(row);
  };
  const onExit = (row) => {
    console.log(row);
  };

  const getData = async () => {
    const userList = await getUserRequest.execute();
    setList(userList.data);
  };

  useEffect(() => {
    getData();
  }, [search]);

  return (
    <Grid item lg={6} sm={12} className={classes.root}>
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
                      <TableCell padding="none">{row.firstName}</TableCell>
                      <TableCell padding="none">{row.lastName}</TableCell>
                      <TableCell padding="none">
                        <Chip
                          label={"ثبت ورود"}
                          className={classes.enter}
                          onClick={() => onEnter(row)}
                        />
                      </TableCell>
                      <TableCell padding="none">
                        <Chip
                          label={"ثبت خروج"}
                          className={classes.exit}
                          onClick={() => onExit(row)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
                {!list.length && !getUserRequest.pending && (
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
        </Paper>
      </div>
    </Grid>
  );
}
