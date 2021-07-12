import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Grid, IconButton } from "@material-ui/core";
import MUIToolTip from "@material-ui/core/Tooltip";
import { useTheme } from "@material-ui/styles";
import {
  ResponsiveContainer,
  AreaChart,
  LineChart,
  CartesianGrid,
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
import { persianNumber, getRandomColorFromTheme } from "../../helpers/utils";
import { useApi } from "../../hooks/useApi";
import { useEffect } from "react";
import { DatePicker } from "@material-ui/pickers";
import moment from "moment";

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
    date: "Page A",
    income: 4000,
    outcome: 2400,
  },
  {
    date: "Page B",
    income: 3000,
    outcome: 1398,
  },
];
const factorPriceChart = [
  {
    date: "Page A",
    buy: 4000,
    sell: 2400,
  },
  {
    date: "Page B",
    buy: 3000,
    sell: 1398,
  },
];
const empoyeeTrafficChart = [
  {
    subject: "فروردین",
    A: 100,
  },
  {
    subject: "ادریبهشت",
    A: 60,
  },
  {
    subject: "خرداد",
    A: 69,
  },
  {
    subject: "تیر",
    A: 75,
  },
  {
    subject: "مرداد",
    A: 95,
  },
  {
    subject: "شهریور",
    A: 90,
  },
  {
    subject: "مهر",
    A: 62,
  },
  {
    subject: "آبان",
    A: 100,
  },
  {
    subject: "آذر",
    A: 85,
  },
  {
    subject: "دی",
    A: 43,
  },
  {
    subject: "بهمن",
    A: 72,
  },
  {
    subject: "اسفند",
    A: 86,
  },
];

const trafficDayliChart = [
  { name: "حاضرین", value: 15, color: "#00989D" },
  { name: "غائبین", value: 5, color: "#FF5C93" },
];

export default function Dashboard(props) {
  var classes = useStyles();
  var theme = useTheme();
  const history = useHistory();
  const [pieChart, setPieChart] = useState([]);
  const [paymentChart, setPaymentChart] = useState([]);
  const [factorChart, setFactorChart] = useState([]);
  const [showFilterBoxPayment, setShowFilterBoxPayment] = useState(false);
  const [showFilterBoxFactor, setShowFilterBoxFactor] = useState(false);
  const [selectedFromDateFactor, handleFromDateChangeFactor] = useState(
    moment(),
  );
  const [selectedToDateFactor, handleToDateChangeFactor] = useState(moment());
  const [selectedFromDatePayment, handleFromDateChangePayment] = useState(
    moment(),
  );
  const [selectedToDatePayment, handleToDateChangePayment] = useState(moment());

  const getDashboardRequest = useApi({
    method: "get",
    url: `dashboard/cashes`,
  });

  const getPaymentRequest = useApi({
    method: "get",
    url: showFilterBoxPayment
      ? `dashboard/payments?{from:${selectedFromDatePayment._d.toISOString()},to:${selectedToDatePayment._d.toISOString()}}`
      : "dashboard/payments",
  });

  const getFactorRequest = useApi({
    method: "get",
    url: showFilterBoxFactor
      ? `dashboard/invoices?{from:${selectedFromDateFactor._d.toISOString()},to:${selectedToDateFactor._d.toISOString()}}`
      : "dashboard/invoices",
  });

  const onClickPaper = (type) => {
    history.push(`/app/${type}`);
  };

  const onChnageDateFactor = (e, type) => {
    if (type === "from") {
      handleFromDateChangeFactor(e);
    } else {
      handleToDateChangeFactor(e);
    }
  };

  const onChnageDatePayment = (e, type) => {
    if (type === "from") {
      handleFromDateChangePayment(e);
    } else {
      handleToDateChangePayment(e);
    }
  };

  const getPieChartData = async () => {
    const dashboardChart = await getDashboardRequest.execute();
    const { cashDesks } = dashboardChart;
    const newCashDesks = [];
    cashDesks?.map((item) => {
      newCashDesks.push({ ...item, color: getRandomColorFromTheme() });
    });
    setPieChart(newCashDesks);
  };

  const getPaymentChart = async () => {
    const chart = await getPaymentRequest.execute();
    const { payments } = chart;
    setPaymentChart(payments);
  };

  const getFactorChart = async () => {
    const chart = await getFactorRequest.execute();
    const { invoices } = chart;
    setFactorChart(invoices);
  };

  useEffect(() => {
    getPieChartData();
  }, []);

  useEffect(() => {
    getPaymentChart();
  }, [selectedFromDatePayment, selectedToDatePayment]);

  useEffect(() => {
    getFactorChart();
  }, [selectedFromDateFactor, selectedToDateFactor]);

  return (
    <>
      <Grid container spacing={4} style={{ marginBottom: 20 }}>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <Paper
            icon="shopping_basket"
            onClick={() => {
              onClickPaper("invoice-detail?type=BUY");
            }}
          >
            <div className={classes.paperTitle}>
              <Typography variant="h3">ثبت خرید</Typography>
            </div>
          </Paper>
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <Paper
            icon="sell"
            onClick={() => {
              onClickPaper("invoice-detail?type=SELL");
            }}
          >
            <div className={classes.paperTitle}>
              <Typography variant="h3">ثبت فروش</Typography>
            </div>
          </Paper>
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <Paper
            icon="move_to_inbox"
            onClick={() => {
              onClickPaper("payment-detail?type=INCOME");
            }}
          >
            <div className={classes.paperTitle}>
              <Typography variant="h3">ثبت دریافت</Typography>
            </div>
          </Paper>
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <Paper
            icon="unarchive"
            onClick={() => {
              onClickPaper("payment-detail?type=OUTCOME");
            }}
          >
            <div className={classes.paperTitle}>
              <Typography variant="h3">ثبت پرداخت</Typography>
            </div>
          </Paper>
        </Grid>
      </Grid>
      <Grid container spacing={4} style={{ marginBottom: 20 }}>
        <Grid item md={3} xs={6}>
          <Paper
            style={{ backgroundColor: "#b8e4c4" }}
            icon="bolt"
            onClick={() => {
              onClickPaper("fast_invoice?type=SELL");
            }}
          >
            <div className={classes.paperTitle}>
              <Typography variant="h3" style={{ color: "#137333" }}>
                فاکتور فروش سریع
              </Typography>
            </div>
          </Paper>
        </Grid>
        <Grid item md={3} xs={6}>
          <Paper
            style={{ backgroundColor: "#f9d5d1" }}
            icon="bolt"
            onClick={() => {
              onClickPaper("fast_invoice?type=BUY");
            }}
          >
            <div className={classes.paperTitle}>
              <Typography variant="h3" style={{ color: "#c5221f" }}>
                فاکتور خرید سریع
              </Typography>
            </div>
          </Paper>
        </Grid>
        <Grid item lg={6} xs={12}>
          <Paper
            icon="transfer_within_a_station"
            onClick={() => {
              onClickPaper("traffic");
            }}
          >
            <div
              className={classes.paperTitle}
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <div>
                <Typography color="text-s" variant="h3">
                  حضور و غیاب
                </Typography>
                <div
                  className={classes.performanceLegendWrapper}
                  style={{ marginTop: 20 }}
                >
                  <div className={classes.legendElement}>
                    <Dot color="secondary" />
                    <Typography
                      color="text"
                      colorBrightness="secondary"
                      className={classes.legendElementText}
                    >
                      غائبین
                    </Typography>
                  </div>
                  <div className={classes.legendElement}>
                    <Dot color="primary" />
                    <Typography
                      color="text"
                      colorBrightness="secondary"
                      className={classes.legendElementText}
                    >
                      حاضرین
                    </Typography>
                  </div>
                </div>
              </div>
              <PieChart width={250} height={100}>
                <Pie
                  data={trafficDayliChart}
                  cx={120}
                  cy={100}
                  startAngle={180}
                  endAngle={0}
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {trafficDayliChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
          </Paper>
        </Grid>
      </Grid>
      <Grid container spacing={4} style={{ marginBottom: 20 }}>
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

        <Grid item lg={6} xs={12}>
          <Widget title="موجودی صندوق ها" upperTitle className={classes.card}>
            <Grid container spacing={2}>
              {pieChart.length && (
                <Grid item sm={6} xs={12}>
                  <div style={{ width: "100%", height: "330px" }}>
                    <div style={{ width: "100%", height: "100%" }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart width="300" height="400">
                          <Pie
                            data={pieChart}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={120}
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
              <Grid item sm={6} xs={12}>
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

                {showFilterBoxPayment && (
                  <>
                    <Grid item lg={3} xs={12} className={classes.datePicker}>
                      <DatePicker
                        autoOk
                        name="date"
                        label="از تاریخ"
                        inputVariant="outlined"
                        okLabel="تأیید"
                        cancelLabel="لغو"
                        labelFunc={(date) =>
                          date ? date.format("jYYYY/jMM/jDD") : ""
                        }
                        value={selectedFromDatePayment}
                        onChange={(e) => onChnageDatePayment(e, "from")}
                        style={{ width: "100%" }}
                      />
                    </Grid>
                    <Grid item lg={3} xs={12} className={classes.datePicker}>
                      <DatePicker
                        autoOk
                        name="date"
                        label="تا تاریخ"
                        inputVariant="outlined"
                        okLabel="تأیید"
                        cancelLabel="لغو"
                        labelFunc={(date) =>
                          date ? date.format("jYYYY/jMM/jDD") : ""
                        }
                        value={selectedToDatePayment}
                        onChange={(e) => onChnageDatePayment(e, "to")}
                        style={{ width: "100%" }}
                      />
                    </Grid>
                  </>
                )}
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
                  <MUIToolTip title="فیلتر">
                    <IconButton
                      onClick={() =>
                        setShowFilterBoxPayment(!showFilterBoxPayment)
                      }
                    >
                      <i class="material-icons-round">filter_alt</i>
                    </IconButton>
                  </MUIToolTip>
                </div>
              </div>
            }
          >
            <ResponsiveContainer width="100%" height={350}>
              <LineChart
                width={500}
                height={300}
                data={paymentChart}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke={theme.palette.primary.main}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="outcome"
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
                {showFilterBoxFactor && (
                  <>
                    <Grid item lg={3} xs={12} className={classes.datePicker}>
                      <DatePicker
                        autoOk
                        name="date"
                        label="از تاریخ"
                        inputVariant="outlined"
                        okLabel="تأیید"
                        cancelLabel="لغو"
                        labelFunc={(date) =>
                          date ? date.format("jYYYY/jMM/jDD") : ""
                        }
                        value={selectedFromDateFactor}
                        onChange={(e) => onChnageDateFactor(e, "from")}
                        style={{ width: "100%" }}
                      />
                    </Grid>
                    <Grid item lg={3} xs={12} className={classes.datePicker}>
                      <DatePicker
                        autoOk
                        name="date"
                        label="تا تاریخ"
                        inputVariant="outlined"
                        okLabel="تأیید"
                        cancelLabel="لغو"
                        labelFunc={(date) =>
                          date ? date.format("jYYYY/jMM/jDD") : ""
                        }
                        value={selectedToDateFactor}
                        onChange={(e) => onChnageDateFactor(e, "to")}
                        style={{ width: "100%" }}
                      />
                    </Grid>
                  </>
                )}
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
                  <MUIToolTip title="فیلتر">
                    <IconButton
                      onClick={() =>
                        setShowFilterBoxFactor(!showFilterBoxFactor)
                      }
                    >
                      <i class="material-icons-round">filter_alt</i>
                    </IconButton>
                  </MUIToolTip>
                </div>
              </div>
            }
          >
            {factorChart.length && (
              <div style={{ width: "100%", height: "450px" }}>
                <div style={{ width: "100%", height: "100%" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      width={100}
                      height={300}
                      data={factorChart}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="buy" fill="#3CD4A0" />
                      <Bar dataKey="sell" fill="#FF5C93" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
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
