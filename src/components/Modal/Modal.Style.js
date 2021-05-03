import { makeStyles } from "@material-ui/core/styles";

export const styles = makeStyles((theme) => ({
  container: {
    padding: "20px",
  },
  title: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: `1px solid ${theme.palette.grey.light}`,
    padding: "20px",
  },
  confirm: {
    padding: "0px 20px 20px",
    display: "flex",
    justifyContent: "flex-end",
  },
}));
