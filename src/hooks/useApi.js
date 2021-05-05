/* eslint-disable */
import { useState } from "react";

import http from "../configs/axios";

export const useApi = (args) => {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState();
  const [error, setError] = useState();

  const execute = async function (data, urlParams) {
    setPending(true);

    try {
      let response;

      if (urlParams) {
        const url = `${args.url}/${urlParams}`;
        response = await http({ ...args, url, data });
      } else {
        response = await http({ ...args, data });
      }

      setResult(response);
      return response.data;
    } catch (e) {
      setResult(null);
      setError(e);
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
