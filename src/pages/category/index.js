import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableContainer,
  TableCell,
  TableRow,
  Paper,
  Typography,
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import TableTop from "../../components/Table/TableTop";
import { useApi } from "../../hooks/useApi";
import DialogActions from "../../redux/actions/dialogAction";
import styles from "./style";
import Detail from "./detail";

const MainList = () => {
  const classes = styles();
  const [customerCategory, setCustomerCategory] = useState([]);
  const [depotCategory, setDepotCategory] = useState([]);
  const [productCategory, setProductCategory] = useState([]);
  const [action, setAction] = useState();
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

  const onAction = ({ name, value }) => {
    debugger;
    const types = {
      customer: async () => {
        if (action === "edit") {
          await EditCustomerCategoryRequest.execute({
            name,
          });
        } else {
          await AddCustomerCategoryRequest.execute({ name });
        }
        getCustomerCategory();
      },
      depot: async () => {
        if (action === "edit") {
          await EditDepotCategoryRequest.execute({
            name,
          });
        } else {
          await AddDepotCategoryRequest.execute({ name });
        }
        getDepotCategory();
      },
      product: async () => {
        if (action === "edit") {
          await EditProductCategoryRequest.execute({
            name,
          });
        } else {
          await AddProductCategoryRequest.execute({ name });
        }
        getProductCategory();
      },
    };
    if (types[selectedType]) {
      onDismiss();
      return types[selectedType]();
    }
  };

  const handleAdd = (type) => {
    setAction("add");
    setSelectedType(type);
  };

  const handleAction = (type, item) => {
    console.log(type, item);
    setAction("edit");
    setSelectedType(type);
    setSelectedCategory(item);
  };

  const onDismiss = () => {
    DialogActions.hide();
    setAction();
  };

  const showEditModal = () => {
    DialogActions.show({
      title: " دسته بندی",
      component: (
        <Detail
          onSubmit={onAction}
          onDismiss={onDismiss}
          defaultValue={selectedCategory}
        />
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
    if (action) {
      showEditModal();
    }
  }, [action]);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableTop
          title="دسته بندی مشتریان"
          onAdd={() => handleAdd("customer")}
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
          onAdd={() => handleAdd("depot")}
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
          title="دسته بندی کالاها"
          onAdd={() => handleAdd("product")}
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
