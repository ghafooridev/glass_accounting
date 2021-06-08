import { makeStyles } from "@material-ui/styles";

export default makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  salary: {
    width: "100%",
    display: "flex",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  salaryPaperLeft: {
    marginBottom: theme.spacing(2),
  },
  salaryPaperRight: {
    marginBottom: theme.spacing(2),
    padding: 20,
  },
  table: {
    minWidth: 750,
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
  PRESENT: {
    backgroundColor: theme.palette.success.main,
  },
  ABSET: {
    backgroundColor: theme.palette.secondary.main,
  },
  rootSelect: {
    display: "flex",
    alignItems: "center",
    padding: 7,
  },
}));
