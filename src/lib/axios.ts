import Axios, { AxiosRequestConfig, AxiosRequestHeaders } from "axios";
import axiosRetry from "axios-retry";
import { API_URL } from "@/config";
import { useNotificationStore } from "@/stores/notifications";
import tokenStorage from "@/utils/tokenStorage";

function authRequestInterceptor(config: AxiosRequestConfig) {
  const token = tokenStorage.getToken();
  if (token) {
    (config.headers as AxiosRequestHeaders).authorization = `${token}`;
  }
  (config.headers as AxiosRequestHeaders).Accept = "application/json";
  return config;
}

export const axios = Axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

axiosRetry(axios, {
  retries: 5,
  retryDelay: (retryCount) => {
    return /* retryCount * */ 1000;
  },
  retryCondition: (error) => {
    try {
      return [502, 503, 504].includes(error?.response?.status as number);
    } catch (e) {
      return false;
    }
  },
});

axios.interceptors.request.use(authRequestInterceptor);
axios.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || error.message;
    useNotificationStore.getState().addNotification({
      type: "error",
      title: "Error",
      message,
    });

    return Promise.reject(error);
  },
);
