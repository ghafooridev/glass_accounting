import React, { useState } from "react";
import {
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@material-ui/core";
import { Inbox as InboxIcon } from "@material-ui/icons";
import { Link } from "react-router-dom";
import classnames from "classnames";
import { useHistory } from "react-router-dom";
import useStyles from "./styles";
import Dot from "../Dot";
import { useTheme } from "@material-ui/styles";
import {
  useLayoutDispatch,
  toggleSidebar,
} from "../../../../context/LayoutContext";
import { hasPermission } from "../../../../helpers/utils";

export default function SidebarLink({
  link,
  icon,
  label,
  children,
  location,
  isSidebarOpened,
  nested,
  type,
  permission,
}) {
  var classes = useStyles();
  const history = useHistory();
  var layoutDispatch = useLayoutDispatch();
  var theme = useTheme();

  const onClick = (link) => {
    history.push(link);
    var windowWidth = window.innerWidth;
    var breakpointWidth = theme.breakpoints.values.md;
    var isSmallScreen = windowWidth < breakpointWidth;

    if (isSmallScreen) {
      toggleSidebar(layoutDispatch);
    }
  };

  var [isOpen, setIsOpen] = useState(false);
  var isLinkActive =
    link &&
    (location.pathname === link || location.pathname.indexOf(link) !== -1);

  if (type === "title")
    return (
      <Typography
        className={classnames(classes.linkText, classes.sectionTitle, {
          [classes.linkTextHidden]: !isSidebarOpened,
        })}
      >
        {label}
      </Typography>
    );

  if (type === "divider")
    return (
      <>
        {hasPermission(permission) && <Divider className={classes.divider} />}
      </>
    );
  if (link && link.includes("http")) {
    return (
      <ListItem
        button
        className={classes.link}
        classes={{
          root: classnames(classes.linkRoot, {
            [classes.linkActive]: isLinkActive && !nested,
            [classes.linkNested]: nested,
          }),
        }}
        disableRipple
      >
        <div className={classes.externalLink} href={link}>
          <ListItemIcon
            className={classnames(classes.linkIcon, {
              [classes.linkIconActive]: isLinkActive,
            })}
          >
            {nested ? <Dot color={isLinkActive && "primary"} /> : icon}
          </ListItemIcon>
          <ListItemText
            classes={{
              primary: classnames(classes.linkText, {
                [classes.linkTextActive]: isLinkActive,
                [classes.linkTextHidden]: !isSidebarOpened,
              }),
            }}
            primary={label}
          />
        </div>
      </ListItem>
    );
  }
  if (!children)
    return (
      <>
        {hasPermission(permission) && (
          <ListItem
            button
            className={classes.link}
            classes={{
              root: classnames(classes.linkRoot, {
                [classes.linkActive]: isLinkActive && !nested,
                [classes.linkNested]: nested,
              }),
            }}
            disableRipple
            onClick={() => {
              onClick(link);
            }}
          >
            <span className={classes.externalLink}>
              <ListItemIcon
                className={classnames(classes.linkIcon, {
                  [classes.linkIconActive]: isLinkActive,
                })}
              >
                {nested ? <Dot color={isLinkActive && "primary"} /> : icon}
              </ListItemIcon>
              <ListItemText
                classes={{
                  primary: classnames(classes.linkText, {
                    [classes.linkTextActive]: isLinkActive,
                    [classes.linkTextHidden]: !isSidebarOpened,
                  }),
                }}
                primary={label}
              />
            </span>
          </ListItem>
        )}
      </>
    );

  return (
    <>
      {hasPermission(permission) && (
        <>
          <ListItem
            button
            component={link && Link}
            onClick={toggleCollapse}
            className={classes.link}
            to={link}
            disableRipple
          >
            <span className={classes.externalLink}>
              <ListItemIcon
                className={classnames(classes.linkIcon, {
                  [classes.linkIconActive]: isLinkActive,
                })}
              >
                {icon ? icon : <InboxIcon />}
              </ListItemIcon>
              <ListItemText
                classes={{
                  primary: classnames(classes.linkText, {
                    [classes.linkTextActive]: isLinkActive,
                    [classes.linkTextHidden]: !isSidebarOpened,
                  }),
                }}
                primary={label}
              />
            </span>
          </ListItem>
          {children && (
            <Collapse
              in={isOpen && isSidebarOpened}
              timeout="auto"
              unmountOnExit
              className={classes.nestedList}
            >
              <List component="div" disablePadding>
                {children.map((childrenLink) => (
                  <SidebarLink
                    key={childrenLink && childrenLink.link}
                    location={location}
                    isSidebarOpened={isSidebarOpened}
                    nested
                    {...childrenLink}
                  />
                ))}
              </List>
            </Collapse>
          )}
        </>
      )}
    </>
  );

  // ###########################################################

  function toggleCollapse(e) {
    if (isSidebarOpened) {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  }
}
