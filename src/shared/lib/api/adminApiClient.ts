import axios from "axios";
import { clearAdminAuthenticated } from "@/shared/lib/adminAuth";

const baseURL = import.meta.env.VITE_API_BASE_URL ?? "/api";

export const adminApi = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
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
