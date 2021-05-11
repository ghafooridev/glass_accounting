import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Table,
  TableBody,
  TableContainer,
  TableCell,
  TableRow,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import TableRowMenu from "../../components/Table/TableRowMenu";
import TableTop from "../../components/Table/TableTop";
import { useApi } from "../../hooks/useApi";
import DialogActions from "../../redux/actions/dialogAction";
import styles from "./style";

const MainList = () => {
  const classes = styles();
  const [customerCategory, setCustomerCategory] = useState([]);
  const [depotCategory, setDepotCategory] = useState([]);
  const [productCategory, setProductCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({
    value: "",
    label: "",
  });
  const [selectedType, setSelectedType] = useState();

  const GetCustomerCategoryRequest = useApi({
    method: "get",
    url: "customer/category",
  });

  const EditCustomerCategoryRequest = useApi({
    method: "put",
    url: `customer/category/${selectedCategory.value}`,
  });

  const AddCustomerCategoryRequest = useApi({
    method: "post",
    url: "customer/category",
  });

  const GetProductCategoryRequest = useApi({
    method: "get",
    url: "product/category",
  });

  const EditProductCategoryRequest = useApi({
    method: "put",
    url: `product/category/${selectedCategory.value}`,
  });

  const AddProductCategoryRequest = useApi({
    method: "post",
    url: "product/category",
  });

  const GetDepotCategoryRequest = useApi({
    method: "get",
    url: "depot/category",
  });

  const EditDepotCategoryRequest = useApi({
    method: "put",
    url: `depot/category/${selectedCategory.value}`,
  });

  const AddDepotCategoryRequest = useApi({
    method: "post",
    url: "depot/category",
  });

  const onAction = (type, id) => {
    const types = {
      customer: () => {
        if (id) {
          return AddCustomerCategoryRequest.execute();
        }
        EditCustomerCategoryRequest.execute();
      },
      depot: () => {
        if (id) {
          return AddDepotCategoryRequest.execute();
        }
        EditDepotCategoryRequest.execute();
      },
      product: () => {
        if (id) {
          return AddProductCategoryRequest.execute();
        }
        EditProductCategoryRequest.execute();
      },
    };
    if (types[type]) {
      return types[type]();
    }
  };

  const onChangeSelectedCategory = (e) => {
    const { value } = e.target;
    setSelectedCategory({ ...selectedCategory, label: value });
  };

  const handleAction = (type, item) => {
    console.log(type, item);
    setSelectedCategory({ ...selectedCategory, item });
    setSelectedType(type);
  };

  const showEditModal = () => {
    DialogActions.show({
      title: " ویرایش دسته بندی",
      component: (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              style={{ width: "100%" }}
              value={selectedCategory.label}
              size="small"
              label="عنوان"
              variant="outlined"
              onChange={onChangeSelectedCategory}
            />
          </Grid>
          <Grid
            item
            xs={12}
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => onAction(selectedType, selectedCategory.value)}
            >
              تایید
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => DialogActions.hide()}
            >
              انصراف
            </Button>
          </Grid>
        </Grid>
      ),
      size: "xs",
      disableCloseButton: true,
    });
  };

  const getCustomerCategory = async () => {
    const customerCategoryList = await GetCustomerCategoryRequest.execute();
    setCustomerCategory(customerCategoryList.data);
  };

  const getDepotCategory = async () => {
    const depotCategoryList = await GetDepotCategoryRequest.execute();
    setDepotCategory(depotCategoryList.data);
  };

  const getProductCategory = async () => {
    const productCategoryList = await GetProductCategoryRequest.execute();
    setProductCategory(productCategoryList.data);
  };

  useEffect(() => {
    getCustomerCategory();
    getDepotCategory();
    getProductCategory();
  }, []);

  useEffect(() => {
    showEditModal();
  }, [selectedCategory]);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableTop
          title="دسته بندی مشتریان"
          onAdd={() => handleAction("customer")}
          toolbarClass={classes.toolbar}
          addButtonClass={classes.addButton}
          minimal
        />
        <TableContainer style={{ padding: "0 10px" }}>
          <Table
            className={classes.table}
            size={"medium"}
            style={{ paddingRight: 10 }}
          >
            <TableBody>
              {customerCategory.map((row) => {
                return (
                  <TableRow
                    hover
                    tabIndex={-1}
                    key={row.id}
                    style={{ paddingRight: 10 }}
                  >
                    <TableCell padding="none">{row.label}</TableCell>

                    <TableCell padding="none" style={{ textAlign: "left" }}>
                      <IconButton onClick={() => handleAction("customer", row)}>
                        <i className="material-icons-round">edit</i>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
              {!customerCategory.length && !getCustomerCategory.pending && (
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
      <Paper className={classes.paper}>
        <TableTop
          title="دسته بندی انبار"
          onAdd={() => handleAction("depot")}
          toolbarClass={classes.toolbar}
          addButtonClass={classes.addButton}
          minimal
        />
        <TableContainer style={{ padding: "0 10px" }}>
          <Table
            className={classes.table}
            size={"medium"}
            style={{ paddingRight: 10 }}
          >
            <TableBody>
              {depotCategory.map((row) => {
                return (
                  <TableRow
                    hover
                    tabIndex={-1}
                    key={row.id}
                    style={{ paddingRight: 10 }}
                  >
                    <TableCell padding="none">{row.label}</TableCell>

                    <TableCell padding="none" style={{ textAlign: "left" }}>
                      <IconButton onClick={() => handleAction("depot", row)}>
                        <i className="material-icons-round">edit</i>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
              {!depotCategory.length && !getDepotCategory.pending && (
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
      <Paper className={classes.paper}>
        <TableTop
          title="دسته بندی انبار"
          onAdd={() => handleAction("product")}
          toolbarClass={classes.toolbar}
          addButtonClass={classes.addButton}
          minimal
        />
        <TableContainer style={{ padding: "0 10px" }}>
          <Table
            className={classes.table}
            size={"medium"}
            style={{ paddingRight: 10 }}
          >
            <TableBody>
              {productCategory.map((row) => {
                return (
                  <TableRow
                    hover
                    tabIndex={-1}
                    key={row.id}
                    style={{ paddingRight: 10 }}
                  >
                    <TableCell padding="none">{row.label}</TableCell>

                    <TableCell padding="none" style={{ textAlign: "left" }}>
                      <IconButton onClick={() => handleAction("product", row)}>
                        <i className="material-icons-round">edit</i>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
              {!productCategory.length && !getProductCategory.pending && (
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
  );
};

export default MainList;
