import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Grid,
  LinearProgress,
  Select,
  OutlinedInput,
  MenuItem,
} from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import {
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  LineChart,
  CartesianGrid,
  Legend,
  Tooltip,
  Line,
  Area,
  PieChart,
  Pie,
  Cell,
  YAxis,
  XAxis,
  Bar,
  BarChart,
  PolarRadiusAxis,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  RadarChart,
} from "recharts";

import useStyles from "./styles";
import Widget from "../../components/Widget";
import { Typography } from "../../components/Wrappers";
import Dot from "../../components/Sidebar/components/Dot";

import Paper from "../../components/Paper";
import {
  persianNumber,
  getRandomColor,
  getRandomColorFromTheme,
} from "../../helpers/utils";
import { useApi } from "../../hooks/useApi";
import { useEffect } from "react";

const CashDeskCahrt = [
  { name: "صندوق 1", amount: 525200, color: "primary" },
  { name: "صندوق 2", amount: 476100, color: "secondary" },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${persianNumber((percent * 100).toFixed(0))}%`}
    </text>
  );
};
const incomeOutcomeChart = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];
const factorPriceChart = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];
const empoyeeTrafficChart = [
  {
    subject: "Math",
    A: 120,
    B: 110,
    fullMark: 150,
  },
  {
    subject: "Chinese",
    A: 98,
    B: 130,
    fullMark: 150,
  },
  {
    subject: "English",
    A: 86,
    B: 130,
    fullMark: 150,
  },
  {
    subject: "Geography",
    A: 99,
    B: 100,
    fullMark: 150,
  },
  {
    subject: "Physics",
    A: 85,
    B: 90,
    fullMark: 150,
  },
  {
    subject: "History",
    A: 65,
    B: 85,
    fullMark: 150,
  },
];

export default function Dashboard(props) {
  var classes = useStyles();
  var theme = useTheme();
  const history = useHistory();
  const [pieChart, setPieChart] = useState([]);

  const getDashboardRequest = useApi({
    method: "get",
    url: `dashboard`,
  });

  const onClickPaper = (type) => {
    history.push(`/app/${type}`);
  };

  const getPieChartData = async () => {
    const dashboardChart = await getDashboardRequest.execute();
    const { cashDesks } = dashboardChart;
    const x = [];
    cashDesks.map((item) => {
      x.push({ ...item, color: getRandomColorFromTheme() });
    });

    const ss = [
      { name: "aaaa", amount: 2222, color: getRandomColorFromTheme() },
      { name: "1", amount: 330, color: getRandomColorFromTheme() },
      { name: "2", amount: 37, color: getRandomColorFromTheme() },
    ];
    setPieChart(ss);
  };

  useEffect(() => {
    getPieChartData();
  }, []);
  console.log(pieChart);
  return (
    <>
      <Grid container spacing={4}>
        <Grid item lg={2} md={4} sm={6} xs={12}>
          <Paper
            icon="shopping_basket"
            onClick={() => {
              onClickPaper("buy");
            }}
          >
            <div className={classes.paperTitle}>
              <Typography variant="h3">ثبت خرید</Typography>
            </div>
          </Paper>
        </Grid>
        <Grid item lg={2} md={4} sm={6} xs={12}>
          <Paper
            icon="sell"
            onClick={() => {
              onClickPaper("sell");
            }}
          >
            <div className={classes.paperTitle}>
              <Typography variant="h3">ثبت فروش</Typography>
            </div>
          </Paper>
        </Grid>
        <Grid item lg={2} md={4} sm={6} xs={12}>
          <Paper
            icon="payments"
            onClick={() => {
              onClickPaper("chek");
            }}
          >
            <div className={classes.paperTitle}>
              <Typography variant="h3">گزارش چک ها</Typography>
            </div>
          </Paper>
        </Grid>
        <Grid item lg={2} md={4} sm={6} xs={12}>
          <Paper
            icon="monetization_on"
            onClick={() => {
              onClickPaper("cash");
            }}
          >
            <div className={classes.paperTitle}>
              <Typography variant="h3">صندوق</Typography>
            </div>
          </Paper>
        </Grid>
      </Grid>
      <Grid container spacing={4}>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <Paper
            icon="receipt_long"
            onClick={() => {
              onClickPaper("worklog");
            }}
          >
            <div className={classes.paperTitle}>
              <Typography color="text-s" variant="h3">
                حضور و غیاب
              </Typography>
            </div>
          </Paper>
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <Paper
            icon="manage_accounts"
            onClick={() => {
              onClickPaper("user-list");
            }}
          >
            <div className={classes.paperTitle}>
              <Typography variant="h3">کاربران</Typography>
            </div>
          </Paper>
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <Paper
            icon="supervisor_account"
            onClick={() => {
              onClickPaper("employee-list");
            }}
          >
            <div className={classes.paperTitle}>
              <Typography variant="h3">پرسنل</Typography>
            </div>
          </Paper>
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <Paper
            icon="record_voice_over"
            onClick={() => {
              onClickPaper("customer-list");
            }}
          >
            <div className={classes.paperTitle}>
              <Typography color="textSecondary" variant="h3">
                مشتریان
              </Typography>
            </div>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        <Grid item lg={6} xs={12}>
          <Widget
            title="موجودی ده روز اخیر صندوق ها"
            upperTitle
            className={classes.card}
            bodyClass={classes.fullHeightBody}
          >
            <div className={classes.serverOverviewElement}>
              <Typography
                color="text"
                colorBrightness="secondary"
                className={classes.serverOverviewElementText}
                noWrap
              >
                صندوق 1
              </Typography>
              <div className={classes.serverOverviewElementChartWrapper}>
                <ResponsiveContainer height={50} width="99%">
                  <AreaChart data={getRandomData(10)}>
                    <Area
                      type="natural"
                      dataKey="value"
                      stroke={theme.palette.secondary.main}
                      fill={theme.palette.secondary.light}
                      strokeWidth={2}
                      fillOpacity="0.25"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className={classes.serverOverviewElement}>
              <Typography
                color="text"
                colorBrightness="secondary"
                className={classes.serverOverviewElementText}
                noWrap
              >
                صندوق 2
              </Typography>
              <div className={classes.serverOverviewElementChartWrapper}>
                <ResponsiveContainer height={50} width="99%">
                  <AreaChart data={getRandomData(10)}>
                    <Area
                      type="natural"
                      dataKey="value"
                      stroke={theme.palette.primary.main}
                      fill={theme.palette.primary.light}
                      strokeWidth={2}
                      fillOpacity="0.25"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className={classes.serverOverviewElement}>
              <Typography
                color="text"
                colorBrightness="secondary"
                className={classes.serverOverviewElementText}
                noWrap
              >
                صندوق 3
              </Typography>
              <div className={classes.serverOverviewElementChartWrapper}>
                <ResponsiveContainer height={50} width="99%">
                  <AreaChart data={getRandomData(10)}>
                    <Area
                      type="natural"
                      dataKey="value"
                      stroke={theme.palette.warning.main}
                      fill={theme.palette.warning.light}
                      strokeWidth={2}
                      fillOpacity="0.25"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Widget>
        </Grid>
        <Grid item lg={6} xs={12}>
          <Widget
            title="فاکتور ها"
            upperTitle
            className={classes.card}
            bodyClass={classes.fullHeightBody}
          >
            <div className={classes.performanceLegendWrapper}>
              <div className={classes.legendElement}>
                <Dot color="warning" />
                <Typography
                  color="text"
                  colorBrightness="secondary"
                  className={classes.legendElementText}
                >
                  فاکتور فروش
                </Typography>
              </div>
              <div className={classes.legendElement}>
                <Dot color="primary" />
                <Typography
                  color="text"
                  colorBrightness="secondary"
                  className={classes.legendElementText}
                >
                  فاکتور خرید
                </Typography>
              </div>
            </div>
            <div className={classes.progressSection}>
              <Typography
                size="md"
                color="text"
                colorBrightness="secondary"
                className={classes.progressSectionTitle}
              >
                {`${persianNumber(77)}%`}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={77}
                classes={{ barColorPrimary: classes.progressBarPrimary }}
                className={classes.progress}
              />
            </div>
            <div>
              <Typography
                size="md"
                color="text"
                colorBrightness="secondary"
                className={classes.progressSectionTitle}
              >
                {`${persianNumber(23)}%`}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={23}
                classes={{ barColorPrimary: classes.progressBarSecondary }}
                className={classes.progress}
              />
            </div>
          </Widget>
        </Grid>

        <Grid style={{ height: 500 }} item lg={6} xs={12}>
          <Widget
            title="میزان حضور پرسنل"
            upperTitle
            bodyClass={classes.fullHeightBody}
            className={classes.card}
          >
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart
                cx="50%"
                cy="50%"
                outerRadius="80%"
                data={empoyeeTrafficChart}
              >
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis />
                <Radar
                  name="Mike"
                  dataKey="A"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </Widget>
        </Grid>

        <Grid style={{ height: 500 }} item lg={6} xs={12}>
          <Widget title="موجودی صندوق ها" upperTitle className={classes.card}>
            <Grid container spacing={2}>
              {pieChart.length && (
                <Grid item xs={8}>
                  <div style={{ width: "100%", height: "330px" }}>
                    <div style={{ width: "100%", height: "100%" }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart width="400" height="400">
                          <Pie
                            data={pieChart}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={150}
                            fill="#8884d8"
                            dataKey="amount"
                          >
                            {pieChart.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </Grid>
              )}
              <Grid item xs={4}>
                <div className={classes.pieChartLegendWrapper}>
                  {pieChart.map(({ name, amount, color }, index) => (
                    <div key={color} className={classes.legendItemContainer}>
                      <Dot color={color} />
                      <Typography variant="h6" style={{ whiteSpace: "nowrap" }}>
                        &nbsp;{name}&nbsp;
                      </Typography>
                      <Typography
                        color="text"
                        variant="h4"
                        colorBrightness="secondary"
                      >
                        &nbsp;{persianNumber(amount)}
                      </Typography>
                    </div>
                  ))}
                </div>
              </Grid>
            </Grid>
          </Widget>
        </Grid>

        <Grid item xs={12}>
          <Widget
            bodyClass={classes.mainChartBody}
            header={
              <div className={classes.mainChartHeader}>
                <Typography
                  variant="h5"
                  color="text"
                  colorBrightness="secondary"
                >
                  دریافتی و پرداختی ها
                </Typography>
                <div className={classes.mainChartHeaderLabels}>
                  <div className={classes.mainChartHeaderLabel}>
                    <Dot color="primary" />
                    <Typography className={classes.mainChartLegentElement}>
                      دریافتی
                    </Typography>
                  </div>
                  <div className={classes.mainChartHeaderLabel}>
                    <Dot color="secondary" />
                    <Typography className={classes.mainChartLegentElement}>
                      پرداختی
                    </Typography>
                  </div>
                </div>
              </div>
            }
          >
            <ResponsiveContainer width="100%" height={350}>
              <LineChart
                width={500}
                height={300}
                data={incomeOutcomeChart}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="pv"
                  stroke={theme.palette.primary.main}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="uv"
                  stroke={theme.palette.secondary.main}
                />
              </LineChart>
            </ResponsiveContainer>
          </Widget>
        </Grid>

        <Grid item xs={12}>
          <Widget
            bodyClass={classes.mainChartBody}
            header={
              <div className={classes.mainChartHeader}>
                <Typography
                  variant="h5"
                  color="text"
                  colorBrightness="secondary"
                >
                  مبلغ فاکتور ها
                </Typography>
                <div className={classes.mainChartHeaderLabels}>
                  <div className={classes.mainChartHeaderLabel}>
                    <Dot color="primary" />
                    <Typography className={classes.mainChartLegentElement}>
                      فاکتور فروش
                    </Typography>
                  </div>
                  <div className={classes.mainChartHeaderLabel}>
                    <Dot color="secondary" />
                    <Typography className={classes.mainChartLegentElement}>
                      فاکتور خرید
                    </Typography>
                  </div>
                </div>
              </div>
            }
          >
            <div style={{ width: "100%", height: "450px" }}>
              <div style={{ width: "100%", height: "100%" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    width={100}
                    height={300}
                    data={factorPriceChart}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="pv" fill="#3CD4A0" />
                    <Bar dataKey="uv" fill="#FF5C93" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Widget>
        </Grid>
      </Grid>
    </>
  );
}

// #######################################################################
function getRandomData(length, min, max, multiplier = 10, maxDiff = 10) {
  var array = new Array(length).fill();
  let lastValue;

  return array.map((item, index) => {
    let randomValue = Math.floor(Math.random() * multiplier + 1);

    while (
      randomValue <= min ||
      randomValue >= max ||
      (lastValue && randomValue - lastValue > maxDiff)
    ) {
      randomValue = Math.floor(Math.random() * multiplier + 1);
    }

    lastValue = randomValue;

    return { value: randomValue };
  });
}

function getMainChartData() {
  var resultArray = [];
  var tablet = getRandomData(31, 3500, 6500, 7500, 1000);
  var desktop = getRandomData(31, 1500, 7500, 7500, 1500);
  var mobile = getRandomData(31, 1500, 7500, 7500, 1500);

  for (let i = 0; i < tablet.length; i++) {
    resultArray.push({
      tablet: tablet[i].value,
      desktop: desktop[i].value,
      mobile: mobile[i].value,
    });
  }

  return resultArray;
}
