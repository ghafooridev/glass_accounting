import React, { useState, useEffect } from "react";
import { Drawer, IconButton, List } from "@material-ui/core";
import { ArrowForward as ArrowForwardIcon } from "@material-ui/icons";
import { useTheme } from "@material-ui/styles";
import { withRouter } from "react-router-dom";
import classNames from "classnames";
import useStyles from "./styles";
import SidebarLink from "./components/SidebarLink/SidebarLink";
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
  },
  {
    id: 1,
    label: "کالاها",
    link: "/app/product-list",
    icon: <i className="material-icons-round">inventory_2</i>,
  },
  {
    id: 1,
    label: "انبار ها",
    link: "/app/depot-list",
    icon: <i className="material-icons-round">storefront</i>,
  },
  {
    id: 2,
    label: "صندوق ها",
    link: "/app/cash-list",
    icon: <i className="material-icons-round">account_balance_wallet</i>,
  },
  {
    id: 2,
    label: "خرید",
    link: "/app/sell-list",
    icon: <i className="material-icons-round">sell</i>,
  },
  {
    id: 3,
    label: "فروش",
    link: "/app/buy-list",
    icon: <i className="material-icons-round">shopping_basket</i>,
  },
  {
    id: 4,
    label: "گزارشات مالی",
    icon: <i className="material-icons-round">monetization_on</i>,
    children: [
      { label: "گردش کل", link: "/app/payment-list?type=ALL" },
      { label: "لیست دریافتی ها", link: "/app/payment-list?type=INCOME" },
      { label: "لیست پرداختی ها", link: "/app/payment-list?type=OUTCOME" },
      { label: "لیست چک ها", link: "/app/ui/chek-list" },
    ],
  },
  { id: 5, type: "divider" },
  {
    id: 6,
    label: "کاربران",
    link: "/app/user-list",
    icon: <i className="material-icons-round">manage_accounts</i>,
  },
  {
    id: 7,
    label: "مشتریان",
    link: "/app/customer-list",
    icon: <i className="material-icons-round">record_voice_over</i>,
  },
  {
    id: 8,
    label: "پرسنل",
    link: "/app/employee-list",
    icon: <i className="material-icons-round">supervisor_account</i>,
  },
  {
    id: 8,
    label: "راننده ها",
    link: "/app/driver-list",
    icon: <i className="material-icons-round">local_shipping</i>,
  },
  { id: 9, type: "divider" },
  {
    id: 10,
    label: "دسته بندی ها ",
    link: "/app/Category",
    icon: <i className="material-icons-round">category</i>,
  },
  {
    id: 10,
    label: "تنظیمات ",
    link: "/app/Settings",
    icon: <i className="material-icons-round">settings</i>,
  },
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
