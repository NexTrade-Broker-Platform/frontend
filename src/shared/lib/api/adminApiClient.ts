import axios from "axios";
import { clearAdminAuthenticated, getAdminToken } from "@/shared/lib/adminAuth";

const baseURL = import.meta.env.VITE_API_BASE_URL ?? "/api";

export const adminApi = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

adminApi.interceptors.request.use((config) => {
  const token = getAdminToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAdminAuthenticated();
      if (!window.location.pathname.startsWith("/admin")) {
        window.location.href = "/admin";
      }
    }
    return Promise.reject(error);
  },
);
