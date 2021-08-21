import React, { useState, useEffect } from "react";
import { Drawer, IconButton, List } from "@material-ui/core";
import { ArrowForward as ArrowForwardIcon } from "@material-ui/icons";
import { useTheme } from "@material-ui/styles";
import { withRouter } from "react-router-dom";
import classNames from "classnames";
import useStyles from "./styles";
import SidebarLink from "./components/SidebarLink/SidebarLink";
import Constants from "../../helpers/constant";
import {
  useLayoutState,
  useLayoutDispatch,
  toggleSidebar,
} from "../../context/LayoutContext";

const structure = [
  {
    id: 0,
    label: "داشبورد",
    link: "/app/dashboard",
    icon: <i className="material-icons-round">home</i>,
    permission: Constants.ALL_PERMISSIONS.FREE,
  },
  {
    id: 1,
    label: "کالاها",
    link: "/app/product-list",
    icon: <i className="material-icons-round">inventory_2</i>,
    permission: Constants.ALL_PERMISSIONS.PRODUCT_SHOW,
  },
  {
    id: 2,
    label: "انبار ها",
    link: "/app/depot-list",
    icon: <i className="material-icons-round">storefront</i>,
    permission: Constants.ALL_PERMISSIONS.DEPOT_SHOW,
  },
  {
    id: 3,
    label: "صندوق ها",
    link: "/app/cash-list",
    icon: <i className="material-icons-round">account_balance_wallet</i>,
    permission: Constants.ALL_PERMISSIONS.CASH_DESK_SHOW,
  },
  {
    id: 4,
    type: "divider",
    permission: Constants.ALL_PERMISSIONS.INVOICE_SHOW,
  },
  {
    id: 5,
    label: "فاکتور ها",
    icon: <i className="material-icons-round">receipt</i>,
    permission: Constants.ALL_PERMISSIONS.INVOICE_SHOW,
    children: [
      { label: "کل فاکتور ها", link: "/app/invoice-list?type=ALL" },
      { label: "فاکتور خرید", link: "/app/invoice-list?type=BUY" },
      { label: "فاکتور فروش", link: "/app/invoice-list?type=SELL" },
    ],
  },
  {
    id: 6,
    type: "divider",
    permission:
      Constants.ALL_PERMISSIONS.PAYMENT_SHOW ||
      Constants.ALL_PERMISSIONS.CHEQUE_SHOW,
  },
  {
    id: 7,
    label: "گزارشات مالی",
    icon: <i className="material-icons-round">monetization_on</i>,
    permission:
      Constants.ALL_PERMISSIONS.PAYMENT_SHOW ||
      Constants.ALL_PERMISSIONS.CHEQUE_SHOW,
    children: [
      { label: "گردش کل", link: "/app/payment-list?type=ALL" },
      { label: "لیست دریافتی ها", link: "/app/payment-list?type=INCOME" },
      { label: "لیست پرداختی ها", link: "/app/payment-list?type=OUTCOME" },
      {
        label: "لیست چک ها",
        link: "/app/cheque-list",
        permission: Constants.ALL_PERMISSIONS.PAYMENT_SHOW,
      },
      {
        label: "لیست شماره حساب ها",
        link: "/app/accountNumber",
        permission: Constants.ALL_PERMISSIONS.FREE,
      },
      {
        label: "لیست وام ها",
        link: "/app/loan-list",
        permission: Constants.ALL_PERMISSIONS.FREE,
      },
    ],
  },
  {
    id: 8,
    type: "divider",
    permission:
      Constants.ALL_PERMISSIONS.CUSTOMER_SHOW ||
      Constants.ALL_PERMISSIONS.USER_SHOW ||
      Constants.ALL_PERMISSIONS.EMPLOYEE_SHOW ||
      Constants.ALL_PERMISSIONS.DRIVER_EDIT,
  },
  {
    id: 9,
    label: "اشخاص",
    icon: <i className="material-icons-round">account_circle</i>,
    // permission:
    //   Constants.ALL_PERMISSIONS.CUSTOMER_SHOW ||
    //   Constants.ALL_PERMISSIONS.USER_SHOW ||
    //   Constants.ALL_PERMISSIONS.EMPLOYEE_SHOW ||
    //   Constants.ALL_PERMISSIONS.DRIVER_EDIT,
    children: [
      {
        label: "کاربران",
        link: "/app/user-list",
        permission: Constants.ALL_PERMISSIONS.USER_SHOW,
      },
      {
        label: "مشتریان",
        link: "/app/customer-list",
        permission: Constants.ALL_PERMISSIONS.CUSTOMER_SHOW,
      },
      {
        label: "پرسنل",
        link: "/app/employee-list",
        permission: Constants.ALL_PERMISSIONS.EMPLOYEE_SHOW,
      },
      {
        label: "رانندگان",
        link: "/app/driver-list",
        permission: Constants.ALL_PERMISSIONS.DRIVER_SHOW,
      },
    ],
  },

  { id: 13, type: "divider", permission: Constants.ALL_PERMISSIONS.FREE },
  {
    id: 14,
    label: " حضور و غیاب",
    icon: <i className="material-icons-round">transfer_within_a_station</i>,
    permission:
      Constants.ALL_PERMISSIONS.ATTENDANCE_FACTORY1_SHOW ||
      Constants.ALL_PERMISSIONS.ATTENDANCE_FACTORY2_SHOW ||
      Constants.ALL_PERMISSIONS.ATTENDANCE_DEPOT_SHOW,
    children: [
      {
        label: "کارخانه یک",
        link: "/app/traffic?type=FACTORY1",
        permission: Constants.ALL_PERMISSIONS.ATTENDANCE_FACTORY1_SHOW,
      },
      {
        label: "کارخانه دو",
        link: "/app/traffic?type=FACTORY2",
        permission: Constants.ALL_PERMISSIONS.ATTENDANCE_FACTORY2_SHOW,
      },
      {
        label: "انبار",
        link: "/app/traffic?type=DEPOT",
        permission: Constants.ALL_PERMISSIONS.ATTENDANCE_DEPOT_SHOW,
      },
    ],
  },

  {
    id: 14,
    label: "دسته بندی ها ",
    link: "/app/Category",
    icon: <i className="material-icons-round">category</i>,
    permission: Constants.ALL_PERMISSIONS.FREE,
  },
  // {
  //   id: 15,
  //   label: "تنظیمات ",
  //   link: "/app/Settings",
  //   icon: <i className="material-icons-round">settings</i>,
  //   permission: Constants.ALL_PERMISSIONS.FREE,
  // },
];

function Sidebar({ location }) {
  var classes = useStyles();
  var theme = useTheme();

  // global
  var { isSidebarOpened } = useLayoutState();
  var layoutDispatch = useLayoutDispatch();

  // local
  var [isPermanent, setPermanent] = useState(true);

  useEffect(function () {
    window.addEventListener("resize", handleWindowWidthChange);
    handleWindowWidthChange();
    return function cleanup() {
      window.removeEventListener("resize", handleWindowWidthChange);
    };
  });

  return (
    <Drawer
      variant={isPermanent ? "permanent" : "temporary"}
      className={classNames(classes.drawer, {
        [classes.drawerOpen]: isSidebarOpened,
        [classes.drawerClose]: !isSidebarOpened,
      })}
      classes={{
        paper: classNames({
          [classes.drawerOpen]: isSidebarOpened,
          [classes.drawerClose]: !isSidebarOpened,
        }),
      }}
      open={isSidebarOpened}
    >
      <div className={classes.toolbar} />
      <div className={classes.mobileBackButton}>
        <IconButton onClick={() => toggleSidebar(layoutDispatch)}>
          <ArrowForwardIcon
            classes={{
              root: classNames(classes.headerIcon, classes.headerIconCollapse),
            }}
          />
        </IconButton>
      </div>
      <List className={classes.sidebarList}>
        {structure.map((link) => (
          <SidebarLink
            key={link.id}
            location={location}
            isSidebarOpened={isSidebarOpened}
            {...link}
          />
        ))}
      </List>
    </Drawer>
  );

  // ##################################################################
  function handleWindowWidthChange() {
    var windowWidth = window.innerWidth;
    var breakpointWidth = theme.breakpoints.values.md;
    var isSmallScreen = windowWidth < breakpointWidth;

    if (isSmallScreen && isPermanent) {
      setPermanent(false);
      toggleSidebar(layoutDispatch);
    } else if (!isSmallScreen && !isPermanent) {
      setPermanent(true);
    }
  }
}

export default withRouter(Sidebar);
