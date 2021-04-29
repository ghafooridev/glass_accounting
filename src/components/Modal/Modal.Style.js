import { makeStyles } from "@material-ui/core/styles"

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
}))
