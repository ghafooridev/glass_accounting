import pickBy from "lodash/pickBy";
import identity from "lodash/identity";
import queryString from "query-string";

export const convertParamsToQueryString = (params) => {
  return new URLSearchParams(pickBy(params, identity)).toString();
};

export const getQueryString = (param) => {
  return queryString.parse(window.location.search)[param];
};
