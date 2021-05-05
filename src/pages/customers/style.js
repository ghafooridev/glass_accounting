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
  status: {
    color: "#fff",
  },
  TALABKAR: {
    backgroundColor: theme.palette.success.main,
  },
  BESTANKAR: {
    backgroundColor: theme.palette.gray.main,
  },
  BEDEHKAR: {
    backgroundColor: theme.palette.secondary.main,
  },
}));
