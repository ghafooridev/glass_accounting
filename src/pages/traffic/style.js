import { makeStyles } from "@material-ui/styles";

export default makeStyles((theme) => ({
  root: {
    width: "100%",
    flexDirection: "column",
    display: "flex",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  dateTime: {
    display: "flex",
  },
  status: {
    color: "#fff",
  },
  CREDITOR: {
    backgroundColor: theme.palette.success.main,
  },
  NODEBT: {
    backgroundColor: theme.palette.gray.main,
  },
  DEBTIOR: {
    backgroundColor: theme.palette.secondary.main,
  },
}));
