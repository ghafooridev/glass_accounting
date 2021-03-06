import axios from "axios";
import { cacheAdapterEnhancer } from "axios-extensions";
import constants from "../helpers/constant";
import storageService from "../services/storage";
import AlertAction from "../redux/actions/AlertAction";

const http = axios.create({
  baseURL: constants.API_ADDRESS,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": "true",
  },
  // adapter: cacheAdapterEnhancer(axios.defaults.adapter),
});

// http.interceptors.request.use(
//   async (config) => {
//     // const accessToken = storageService.getItem(constants.ACCESS_TOKEN);
//     // config.headers = {
//     //   Authorization: `Bearer ${accessToken}`,
//     //   "Cache-Control": "no-cache",
//     //   Accept: "application/json",
//     // };
//     // return config;
//   },
//   (error) => {
//     Promise.reject(error);
//   },
// );

http.interceptors.response.use(
  (result) => {
    // Do something before request is sent
    const { method, url } = result.config;
    // if ((method === "post" || method === "put") && url !== "auth/login") {
    //   return AlertAction.show({
    //     type: "success",
    //     text: "اطلاعات با موفقیت ثبت شد",
    //   });
    // }
    // if (method === "delete") {
    //   return AlertAction.show({
    //     type: "success",
    //     text: "اطلاعات با موفقیت حذف شد",
    //   });
    // }
    if (method !== "get") {
      if (url !== "auth/login") {
        AlertAction.show({
          type: "success",
          text:
            method === "delete"
              ? "اطلاعات با موفقیت حذف شد"
              : "اطلاعات با موفقیت ثبت شد",
        });
      }
    }
    return result;
  },
  async (error) => {
    const { code, message } = error.response.data.error;
    if (code === "UNHANDLED_DATABASE_EXCEPTION") {
      AlertAction.show({
        type: "error",
        text: "خطایی رخ داده است",
      });
    } else {
      AlertAction.show({
        type: "error",
        text: message,
      });
    }

    // TODO : handle 4xx error here and calling refresh token
    // const originalRequest = error.config;
    // if (error.response.status === 403 && !originalRequest._retry) {
    // const access_token = await refreshAccessToken();
    // axios.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
    // return axiosApiInstance(originalRequest);
    // }

    return Promise.reject(error);
  },
);

export default http;
