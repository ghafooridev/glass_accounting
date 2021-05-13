import React, { Fragment, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
} from "@material-ui/core";
import { useForm, Controller } from "react-hook-form";
import { useApi } from "../../hooks/useApi";
import Constant from "../../helpers/constant";
import { getQueryString } from "../../helpers/utils";
import CircularProgress from "../../components/CircularProgress";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "0 auto",
  },
  paper: {
    width: "100%",
    padding: 20,
  },
  title: {
    paddingBottom: 20,
  },
}));

export default function MainDetail() {
  const classes = useStyles();
  const history = useHistory();
  const id = getQueryString("id");
  const [detail, setDetail] = useState({});
  const { control, handleSubmit, errors, reset } = useForm();
  const [category, setCategory] = useState([]);
  const [depotCategory, setDepotCategory] = useState(1);

  const addDepotRequest = useApi({
    method: "post",
    url: `depot`,
  });
  const editDepotRequest = useApi({
    method: "put",
    url: `depot/${id}`,
  });
  const detailDepotRequest = useApi({
    method: "get",
    url: `depot/${id}`,
  });
  const depotCategoryRequest = useApi({
    method: "get",
    url: `depot/category`,
  });

  const onSubmit = async (data) => {
    const value = { ...data, depotCategoryId: depotCategory };

    if (id) {
      return await editDepotRequest.execute(value);
    }
    await addDepotRequest.execute(value);
  };

  const onReject = () => {
    history.push("/app/depot-list");
  };

  const getDetail = async () => {
    const detail = await detailDepotRequest.execute();
    setDetail(detail.data);
    setDepotCategory(detail.data.depotCategory);
  };

  const getDepotCategory = async () => {
    const detail = await depotCategoryRequest.execute();
    setCategory(detail.data);
  };

  const onChangeCategory = (e) => {
    setDepotCategory(e.target.value);
  };

  useEffect(() => {
    getDepotCategory();
    if (id) {
      getDetail();
    }
  }, []);

  useEffect(() => {
    reset(detail);
  }, [reset, detail]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {!detailDepotRequest.pending ? (
        <Grid item lg={6} sm={12} className={classes.root}>
          <Paper className={classes.paper}>
            <Typography
              className={classes.title}
              variant="h6"
              id="tableTitle"
              component="div"
            >
              {id ? "ویرایش انبار" : "افزودن انبار"}
            </Typography>

            <Grid container spacing={3}>
              <Fragment>
                <Grid item lg={6} xs={12}>
                  <Controller
                    control={control}
                    render={({ onChange, value, name }) => {
                      return (
                        <TextField
                          variant="outlined"
                          label="نام"
                          name={name}
                          onChange={onChange}
                          value={value}
                          error={!!errors.name}
                          helperText={errors.name ? errors.name.message : ""}
                          fullWidth
                          size="small"
                        />
                      );
                    }}
                    rules={{ required: Constant.VALIDATION.REQUIRED }}
                    name="name"
                  />
                </Grid>

                <Grid item lg={6} xs={12}>
                  {!!category.length && depotCategory && (
                    <TextField
                      select
                      label="دسته بندی"
                      value={depotCategory}
                      onChange={onChangeCategory}
                      variant="outlined"
                      error={!!errors.depotCategory}
                      helperText={
                        errors.depotCategory ? errors.depotCategory.message : ""
                      }
                      fullWidth
                      size="small"
                    >
                      {category.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                </Grid>

                <Grid item lg={6} xs={12}>
                  <Controller
                    control={control}
                    render={({ onChange, value, name }) => {
                      return (
                        <TextField
                          variant="outlined"
                          label="تلفن"
                          name={name}
                          onChange={onChange}
                          value={value}
                          error={!!errors.phone}
                          helperText={errors.phone ? errors.phone.message : ""}
                          fullWidth
                          size="small"
                        />
                      );
                    }}
                    name="phone"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    control={control}
                    render={({ onChange, value, name }) => {
                      return (
                        <TextField
                          variant="outlined"
                          label="آدرس"
                          name={name}
                          onChange={onChange}
                          value={value}
                          error={!!errors.address}
                          helperText={
                            errors.address ? errors.address.message : ""
                          }
                          fullWidth
                          size="small"
                        />
                      );
                    }}
                    name="address"
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Button variant="contained" color="primary" type="submit">
                    تایید
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={onReject}
                  >
                    بازگشت
                  </Button>
                </Grid>
              </Fragment>
            </Grid>
          </Paper>
        </Grid>
      ) : (
        <CircularProgress />
      )}
    </form>
  );
}
