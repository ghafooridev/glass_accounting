import React, { useEffect, useState } from "react";
import { Grid, TextField, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Constant from "../../helpers/constant";
import { getQueryString, persianNumber } from "../../helpers/utils";
import Widget from "../../components/Widget";
import Line from "./line";
import LineMax from "./lineMax";
import Area from "./area";
import AreaFill from "./areaFill";
import Bar from "./bar";
// import BarCustom from "./barCustom";
import BrushBar from "./brushBar";
import Bubble from "./bubble";
import MixBar from "./mixBar";
import ComposeBar from "./composeBar";
import Pie from "./pie";
import Radar from "./radar";
import Radial from "./radial";
import Scatter from "./scatter";
import StackArea from "./stackArea";
import Tree from "./tree";
import TwinBar from "./twinBar";
import TwoPie from "./twoPie";
import Dot from "./dot";
import VerticalLine from "./verticalLine";
const useStyles = makeStyles((theme) => ({
  img: {
    width: 35,
    height: 35,
    borderRadius: 50,
    marginLeft: 20,
  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: 50,
    cursor: "pointer",
  },
  grid: {
    display: "flex",
    alignItems: "center",
  },
}));

export default function MainDetail({}) {
  const classes = useStyles();
  const type = getQueryString("type");

  useEffect(() => {}, []);

  return (
    <Grid container spacing={3}>
      {type === "cash" && (
        <Grid item lg={6} xs={12}>
          <Widget
            title="تست"
            upperTitle
            bodyClass={classes.fullHeightBody}
            className={classes.card}
          >
            <Line />
          </Widget>
        </Grid>
      )}
      {type === "cash" && (
        <Grid item lg={6} xs={12}>
          <Widget
            title="تست"
            upperTitle
            bodyClass={classes.fullHeightBody}
            className={classes.card}
          >
            <LineMax />
          </Widget>
        </Grid>
      )}
      {type === "cash" && (
        <Grid item lg={6} xs={12}>
          <Widget
            title="تست"
            upperTitle
            bodyClass={classes.fullHeightBody}
            className={classes.card}
          >
            <Area />
          </Widget>
        </Grid>
      )}
      {type === "cash" && (
        <Grid item lg={6} xs={12}>
          <Widget
            title="تست"
            upperTitle
            bodyClass={classes.fullHeightBody}
            className={classes.card}
          >
            <AreaFill />
          </Widget>
        </Grid>
      )}
      {type === "cash" && (
        <Grid item lg={6} xs={12}>
          <Widget
            title="تست"
            upperTitle
            bodyClass={classes.fullHeightBody}
            className={classes.card}
          >
            <Bar />
          </Widget>
        </Grid>
      )}
      {type === "cash" && (
        <Grid item lg={6} xs={12}>
          <Widget
            title="تست"
            upperTitle
            bodyClass={classes.fullHeightBody}
            className={classes.card}
          >
            <BrushBar />
          </Widget>
        </Grid>
      )}
      {type === "cash" && (
        <Grid item lg={6} xs={12}>
          <Widget
            title="تست"
            upperTitle
            bodyClass={classes.fullHeightBody}
            className={classes.card}
          >
            <Bubble />
          </Widget>
        </Grid>
      )}
      {type === "cash" && (
        <Grid item lg={6} xs={12}>
          <Widget
            title="تست"
            upperTitle
            bodyClass={classes.fullHeightBody}
            className={classes.card}
          >
            <MixBar />
          </Widget>
        </Grid>
      )}
      {type === "cash" && (
        <Grid item lg={6} xs={12}>
          <Widget
            title="تست"
            upperTitle
            bodyClass={classes.fullHeightBody}
            className={classes.card}
          >
            <ComposeBar />
          </Widget>
        </Grid>
      )}
      {type === "cash" && (
        <Grid item lg={6} xs={12}>
          <Widget
            title="تست"
            upperTitle
            bodyClass={classes.fullHeightBody}
            className={classes.card}
          >
            <Pie />
          </Widget>
        </Grid>
      )}
      {type === "cash" && (
        <Grid item lg={6} xs={12}>
          <Widget
            title="تست"
            upperTitle
            bodyClass={classes.fullHeightBody}
            className={classes.card}
          >
            <Radar />
          </Widget>
        </Grid>
      )}
      {type === "cash" && (
        <Grid item lg={6} xs={12}>
          <Widget
            title="تست"
            upperTitle
            bodyClass={classes.fullHeightBody}
            className={classes.card}
          >
            <Radial />
          </Widget>
        </Grid>
      )}
      {type === "cash" && (
        <Grid item lg={6} xs={12}>
          <Widget
            title="تست"
            upperTitle
            bodyClass={classes.fullHeightBody}
            className={classes.card}
          >
            <Scatter />
          </Widget>
        </Grid>
      )}
      {type === "cash" && (
        <Grid item lg={6} xs={12}>
          <Widget
            title="تست"
            upperTitle
            bodyClass={classes.fullHeightBody}
            className={classes.card}
          >
            <StackArea />
          </Widget>
        </Grid>
      )}
      {type === "cash" && (
        <Grid item lg={6} xs={12}>
          <Widget
            title="تست"
            upperTitle
            bodyClass={classes.fullHeightBody}
            className={classes.card}
          >
            <Tree />
          </Widget>
        </Grid>
      )}
      {type === "cash" && (
        <Grid item lg={6} xs={12}>
          <Widget
            title="تست"
            upperTitle
            bodyClass={classes.fullHeightBody}
            className={classes.card}
          >
            <TwinBar />
          </Widget>
        </Grid>
      )}
      {type === "cash" && (
        <Grid item lg={6} xs={12}>
          <Widget
            title="تست"
            upperTitle
            bodyClass={classes.fullHeightBody}
            className={classes.card}
          >
            <TwoPie />
          </Widget>
        </Grid>
      )}
      {type === "cash" && (
        <Grid item lg={6} xs={12}>
          <Widget
            title="تست"
            upperTitle
            bodyClass={classes.fullHeightBody}
            className={classes.card}
          >
            <Dot />
          </Widget>
        </Grid>
      )}
      {type === "cash" && (
        <Grid item lg={6} xs={12}>
          <Widget
            title="تست"
            upperTitle
            bodyClass={classes.fullHeightBody}
            className={classes.card}
          >
            <VerticalLine />
          </Widget>
        </Grid>
      )}
    </Grid>
  );
}
