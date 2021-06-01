import pickBy from "lodash/pickBy";
import identity from "lodash/identity";
import queryString from "query-string";
import storageService from "../services/storage";
import Constant from "./constant";

export const convertParamsToQueryString = (params) => {
  return new URLSearchParams(pickBy(params, identity)).toString();
};

export const getQueryString = (param) => {
  return queryString.parse(window.location.search)[param];
};

export const getRandomColor = () => {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};

export const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const persianNumber = (en) => {
  return ("" + en).replace(/[0-9]/g, function (t) {
    return "۰۱۲۳۴۵۶۷۸۹".substr(+t, 1);
  });
};

export const hasPermission = (permit) => {
  if (permit === Constant.ALL_PERMISSIONS.FREE) {
    return true;
  }
  const { permissions } = JSON.parse(
    storageService.getItem(Constant.STORAGE.CURRENT_USER),
  );
  return permissions.includes(permit);
};
