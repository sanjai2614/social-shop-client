
import axios from "axios";
import { env } from "../config/env.js";
import { getAccessToken } from "../api/tokenHelper.js";

const api = axios.create({
  baseURL: env.API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
