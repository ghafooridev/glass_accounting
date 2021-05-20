import pickBy from "lodash/pickBy";
import identity from "lodash/identity";
import queryString from "query-string";

export const convertParamsToQueryString = (params) => {
  return new URLSearchParams(pickBy(params, identity)).toString();
};

export const getQueryString = (param) => {
  return queryString.parse(window.location.search)[param];
};

export const getRandomColor = () => {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};

export const persianNumber = (en) => {
  return ("" + en).replace(/[0-9]/g, function (t) {
    return "۰۱۲۳۴۵۶۷۸۹".substr(+t, 1);
  });
};
