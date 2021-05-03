/* eslint-disable */
import { useState } from "react";

import http from "../configs/axios";

export const useApi = (args) => {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState();
  const [error, setError] = useState();

  const execute = async function (data) {
    setPending(true);

    try {
      let response;
      if (args.method === "delete" && data) {
        const option = { method: "delete", url: `${args.url}/${data}` };
        response = await http({ ...option });
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
