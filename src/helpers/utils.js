import pickBy from "lodash/pickBy";
import identity from "lodash/identity";

export const convertParamsToQueryString = (params) => {
  return new URLSearchParams(pickBy(params, identity)).toString();
};
