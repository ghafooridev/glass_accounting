/* eslint-disable */
import { useState } from "react";

import http from "../configs/axios";

const getProperUrl = (url, urlParams) => {
  console.log(url, urlParams);
  return `${url.substring(0, url.indexOf("?"))}/${urlParams}?${url.substring(
    url.indexOf("?") + 1,
    url.length,
  )}`;
};

export const useApi = (args) => {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState();
  const [error, setError] = useState();

  const execute = async function (data, urlParams) {
    setPending(true);
    try {
      let response;

      if (urlParams) {
        if (args.url.includes("?")) {
          const url = getProperUrl(args.url, urlParams);
          response = await http({ ...args, url, data });
        } else {
          const url = `${args.url}/${urlParams}`;
          response = await http({ ...args, url, data });
        }
      } else {
        response = await http({ ...args, data });
      }

      setResult(response);
      return response.data;
    } catch (e) {
      setResult(null);
      setError(e);
      throw new Error(e);
    } finally {
      setPending(false);
    }
  };

  return {
    pending,
    result,
    error,
    execute,
  };
};
