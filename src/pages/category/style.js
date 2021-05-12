import { makeStyles } from "@material-ui/styles";

export default makeStyles((theme) => ({
  root: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "baseline",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
  paper: {
    width: "30%",
    [theme.breakpoints.down("xs")]: {
      width: "90%",
    },
    margin: "10px 20px",
  },
  toolbar: {
    backgroundColor: theme.palette.primary.main,
    "& .MuiTypography-h6": {
      color: "white",
    },
  },
}));
