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
  tab: {
    borderBottom: `1px solid ${theme.palette.gray.main}`,
  },
  type: {
    color: "#fff",
  },
  allIcon: {
    color: theme.palette.primary.main,
  },
  income: {
    backgroundColor: theme.palette.success.main,
  },
  incomeIcon: {
    color: theme.palette.success.main,
  },
  outgo: {
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
