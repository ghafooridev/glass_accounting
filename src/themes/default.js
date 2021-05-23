const primary = "#536DFE";
const secondary = "#FF5C93";
const warning = "#FFC260";
const success = "#3CD4A0";
const info = "#9013FE";
const gray = "#B9B9B9";

const defaultTheme = {
  direction: "rtl",

  palette: {
    primary: {
      main: primary,
      light: "#dcf0fa",
      dark: primary,
    },
    secondary: {
      main: secondary,
      light: secondary,
      dark: secondary,
      contrastText: "#FFFFFF",
    },
    danger: {
      main: secondary,
      light: secondary,
      dark: secondary,
      contrastText: "#FFFFFF",
    },
    warning: {
      main: warning,
      light: warning,
      dark: warning,
    },
    success: {
      main: success,
      light: success,
      dark: success,
    },
    info: {
      main: info,
      light: info,
      dark: info,
    },
    gray: {
      main: gray,
      light: gray,
      dark: gray,
    },
    text: {
      primary: "#6E6E6E",
      secondary: "#6E6E6E",
      hint: "#B9B9B9",
    },
    background: {
      default: "#F6F7FF",
      light: "#F3F5FF",
    },
  },
  customShadows: {
    widget:
      "0px 3px 11px 0px #E8EAFC, 0 3px 3px -2px #B2B2B21A, 0 1px 8px 0 #9A9A9A1A",
    widgetDark:
      "0px 3px 18px 0px #4558A3B3, 0 3px 3px -2px #B2B2B21A, 0 1px 8px 0 #9A9A9A1A",
    widgetWide:
      "0px 12px 33px 0px #E8EAFC, 0 3px 3px -2px #B2B2B21A, 0 1px 8px 0 #9A9A9A1A",
  },
  overrides: {
    MuiBackdrop: {
      root: {
        backgroundColor: "#4A4A4A1A",
      },
    },
    MuiMenu: {
      paper: {
        boxShadow:
          "0px 3px 11px 0px #E8EAFC, 0 3px 3px -2px #B2B2B21A, 0 1px 8px 0 #9A9A9A1A",
      },
    },
    MuiSelect: {
      icon: {
        color: "#B9B9B9",
      },
    },
    MuiListItem: {
      root: {
        "&$selected": {
          backgroundColor: "#F3F5FF !important",
          "&:focus": {
            backgroundColor: "#F3F5FF",
          },
        },
      },
      button: {
        "&:hover, &:focus": {
          backgroundColor: "#F3F5FF",
        },
      },
    },
    MuiTouchRipple: {
      child: {
        backgroundColor: "white",
      },
    },
    MuiTableRow: {
      root: {
        height: 45,
      },
    },
    MuiTableCell: {
      root: {
        borderBottom: "1px solid rgba(224, 224, 224, .5)",
        paddingLeft: 24,
      },
      head: {
        fontSize: "0.95rem",
      },
      body: {
        fontSize: "0.95rem",
      },
    },
    PrivateSwitchBase: {
      root: {
        marginLeft: 10,
      },
    },
  },
};

export default defaultTheme;
