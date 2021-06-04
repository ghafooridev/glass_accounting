import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Divider,
  Button,
} from "@material-ui/core";
import { useHistory, useLocation } from "react-router-dom";

import {
  Menu as MenuIcon,
  MailOutline as MailIcon,
  NotificationsNone as NotificationsIcon,
  Person as AccountIcon,
  Send as SendIcon,
  ArrowForward as ArrowForwardIcon,
} from "@material-ui/icons";
import classNames from "classnames";
import useStyles from "./styles";
import { Badge, Typography } from "../Wrappers";
import UserAvatar from "../UserAvatar/UserAvatar";
import {
  useLayoutState,
  useLayoutDispatch,
  toggleSidebar,
} from "../../context/LayoutContext";
import { useUserState } from "../../context/UserContext";
import { useUserDispatch, signOut } from "../../context/UserContext";
import { useApi } from "../../hooks/useApi";
import { persianNumber } from "../../helpers/utils";
import clsx from "clsx";
import Constant from "../../helpers/constant";

const messages = [
  {
    id: 0,
    variant: "warning",
    name: "تست",
    message: "یادآوری چک",
    time: "9:10",
  },
  {
    id: 0,
    variant: "warning",
    name: "تست",
    message: "یادآوری چک",
    time: "9:10",
  },
  {
    id: 0,
    variant: "warning",
    name: "تست",
    message: "یادآوری چک",
    time: "9:10",
  },
];
//notify/cheque
export default function Header(props) {
  var classes = useStyles();
  const history = useHistory();
  var layoutState = useLayoutState();
  var layoutDispatch = useLayoutDispatch();
  var userDispatch = useUserDispatch();
  const location = useLocation();
  var [mailMenu, setMailMenu] = useState(null);
  var [profileMenu, setProfileMenu] = useState(null);
  var { currentUser } = useUserState();
  const [cheques, setCheques] = useState([]);

  const getDashboardRequest = useApi({
    method: "get",
    url: `notify/cheque`,
  });

  const getChequeNotify = async () => {
    const notify = await getDashboardRequest.execute();

    setCheques(notify.data);
  };

  const onShowAllCheque = () => {
    history.push("/app/cheque-list");
  };

  const onChangePassword = () => {};

  useEffect(() => {
    getChequeNotify();
  }, [location]);

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <IconButton
          color="inherit"
          onClick={() => toggleSidebar(layoutDispatch)}
          className={classNames(
            classes.headerMenuButtonSandwich,
            classes.headerMenuButtonCollapse,
          )}
        >
          {layoutState.isSidebarOpened ? (
            <ArrowForwardIcon
              classes={{
                root: classNames(
                  classes.headerIcon,
                  classes.headerIconCollapse,
                ),
              }}
            />
          ) : (
            <MenuIcon
              classes={{
                root: classNames(
                  classes.headerIcon,
                  classes.headerIconCollapse,
                ),
              }}
            />
          )}
        </IconButton>
        <Typography variant="h6" weight="medium" className={classes.logotype}>
          سیستم حسابداری
        </Typography>
        <div className={classes.grow} />

        <IconButton
          color="inherit"
          aria-haspopup="true"
          aria-controls="mail-menu"
          onClick={(e) => {
            setMailMenu(e.currentTarget);
          }}
          className={classes.headerMenuButton}
        >
          <Badge badgeContent={cheques.length} color="secondary">
            <NotificationsIcon classes={{ root: classes.headerIcon }} />
          </Badge>
        </IconButton>
        <IconButton
          aria-haspopup="true"
          color="inherit"
          className={classes.headerMenuButton}
          aria-controls="profile-menu"
          onClick={(e) => setProfileMenu(e.currentTarget)}
        >
          <AccountIcon classes={{ root: classes.headerIcon }} />
        </IconButton>
        <Menu
          id="mail-menu"
          open={Boolean(mailMenu)}
          anchorEl={mailMenu}
          onClose={() => setMailMenu(null)}
          MenuListProps={{ className: classes.headerMenuList }}
          className={classes.headerMenu}
          classes={{ paper: classes.profileMenu }}
          disableAutoFocusItem
        >
          <div className={classes.profileMenuUser}>
            <Typography variant="h6" weight="medium">
              یادآوری چک ها
            </Typography>
            <Button color="primary" onClick={onShowAllCheque}>
              نمایش همه چک ها
            </Button>
          </div>
          <Divider />
          {cheques.map((message) => (
            <MenuItem key={message.id} className={classes.messageNotification}>
              <Typography variant="h6">
                {persianNumber(
                  new Date(message.chequeDueDate).toLocaleDateString("fa-IR"),
                )}
              </Typography>
              <Typography variant="h6">{message.person}</Typography>
              <Typography variant="h6">
                {persianNumber(message.price)}
              </Typography>
              <Typography variant="h6">
                <Chip
                  label={Constant.PAYMENT_TYPE[message.type]}
                  className={clsx(classes.chip, classes[message.type])}
                />
              </Typography>
            </MenuItem>
          ))}
        </Menu>
        <Menu
          id="profile-menu"
          open={Boolean(profileMenu)}
          anchorEl={profileMenu}
          onClose={() => setProfileMenu(null)}
          className={classes.headerMenu}
          classes={{ paper: classes.profileMenu }}
          disableAutoFocusItem
        >
          <div className={classes.profileMenuUser}>
            <Typography variant="h4" weight="medium">
              {currentUser.username}
            </Typography>
          </div>
          <MenuItem
            className={classNames(
              classes.profileMenuItem,
              classes.headerMenuItem,
            )}
          >
            <Typography
              className={classes.profileMenuLink}
              color="primary"
              onClick={onChangePassword}
            >
              تغییر پسورد
            </Typography>
          </MenuItem>

          <MenuItem
            className={classNames(
              classes.profileMenuItem,
              classes.headerMenuItem,
            )}
          >
            <Typography
              className={classes.profileMenuLink}
              color="primary"
              onClick={() => signOut(userDispatch, props.history)}
            >
              خروج از سیستم
            </Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
