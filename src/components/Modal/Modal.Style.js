import { makeStyles } from "@material-ui/core/styles";

export const styles = makeStyles((theme) => ({
  container: {
    padding: "20px",
    overflowX: "hidden",
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
  // overlay: {
  //   position: "fixed",
  //   display: "none",
  //   width: "100%",
  //   height: "100%",
  //   top: 0,
  //   left: 0,
  //   right: 0,
  //   bottom: 0,
  //   backgroundColor: "rgba(0,0,0,0.5)",
  //   zIndex: 2,
  //   cursor: "pointer",
  // },
}));
