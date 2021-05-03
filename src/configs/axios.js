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
  (config) => {
    // Do something before request is sent
    console.log("success", config);
    return config;
  },
  async (error) => {
    console.log("error", error.response);
    AlertAction.show({
      type: "error",
      text: "hey",
    });

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
