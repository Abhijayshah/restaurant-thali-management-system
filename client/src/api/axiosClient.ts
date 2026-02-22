import axios from "axios";
import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { store } from "../store/store";
import { authLogout } from "../store/authSlice";

const baseURL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

const axiosClient: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const state = store.getState() as {
      auth: { token: string | null };
    };
    const token = state.auth.token;

    if (!token) {
      return config;
    }

    config.headers.set("Authorization", `Bearer ${token}`);

    return config;
  }
);

axiosClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      store.dispatch(authLogout());
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
