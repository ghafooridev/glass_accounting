import { makeStyles } from "@material-ui/styles";

export default makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  chip: {
    color: "#fff",
  },
  allIcon: {
    color: theme.palette.primary.main,
  },
  INCOME: {
    backgroundColor: theme.palette.success.main,
  },
  incomeIcon: {
    color: theme.palette.success.main,
  },
  OUTCOME: {
    backgroundColor: theme.palette.danger.main,
  },
  outgoIcon: {
    color: theme.palette.danger.main,
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
