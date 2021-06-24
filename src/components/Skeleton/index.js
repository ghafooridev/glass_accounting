import React from "react";
import Skeleton from "@material-ui/lab/Skeleton";
import {
  Table,
  TableBody,
  TableContainer,
  TableCell,
  TableRow,
  Paper,
  Typography,
  Grid,
  Divider,
} from "@material-ui/core";
import { getRandomNumber } from "../../helpers/utils";

export default function CustomSkeleton({ headCount }) {
  return (
    <Paper style={{ padding: 10 }}>
      <Grid
        container
        spacing={3}
        style={{
          width: "100%",
          display: "flex",
          padding: "20px 0",
          justifyContent: "space-between",
        }}
      >
        <Grid item style={{ width: `20%` }}>
          <Skeleton variant="rect" />
        </Grid>
        <Grid item style={{ width: `15%` }}>
          <Skeleton variant="rect" />
        </Grid>
      </Grid>
      <Grid
        container
        spacing={3}
        style={{ width: "100%", display: "flex", padding: "20px 0" }}
      >
        {headCount.map((item) => {
          return (
            <Grid item style={{ width: `${100 / headCount.length}%` }}>
              <Skeleton variant="text" />
            </Grid>
          );
        })}
      </Grid>
      <Divider />
      <div>
        <Grid
          container
          spacing={3}
          style={{ width: "100%", display: "flex", padding: "10px 0" }}
        >
          {headCount.map((item) => {
            return (
              <Grid item style={{ width: `${100 / headCount.length}%` }}>
                <Skeleton
                  variant="text"
                  width={`${getRandomNumber(60, 100)}%`}
                />
              </Grid>
            );
          })}
        </Grid>
        <Divider />
        <Grid
          container
          spacing={3}
          style={{ width: "100%", display: "flex", padding: "10px 0" }}
        >
          {headCount.map((item) => {
            return (
              <Grid item style={{ width: `${100 / headCount.length}%` }}>
                <Skeleton
                  variant="text"
                  width={`${getRandomNumber(60, 100)}%`}
                />
              </Grid>
            );
          })}
        </Grid>
        <Divider />
        <Grid
          container
          spacing={3}
          style={{ width: "100%", display: "flex", padding: "10px 0" }}
        >
          {headCount.map((item) => {
            return (
              <Grid item style={{ width: `${100 / headCount.length}%` }}>
                <Skeleton
                  variant="text"
                  width={`${getRandomNumber(60, 100)}%`}
                />
              </Grid>
            );
          })}
        </Grid>
        <Divider />
        <Grid
          container
          spacing={3}
          style={{ width: "100%", display: "flex", padding: "10px 0" }}
        >
          {headCount.map((item) => {
            return (
              <Grid item style={{ width: `${100 / headCount.length}%` }}>
                <Skeleton
                  variant="text"
                  width={`${getRandomNumber(60, 100)}%`}
                />
              </Grid>
            );
          })}
        </Grid>
      </div>
      <Divider />
      <Grid
        container
        spacing={3}
        style={{ width: "100%", display: "flex", padding: "20px 0" }}
      >
        <Grid item style={{ width: `10%` }}>
          <Skeleton variant="rect" />
        </Grid>
      </Grid>
    </Paper>
  );
}
