import axios from "axios";
import {
  clearAuthenticated,
  markAuthenticated,
} from "@/shared/lib/auth";
import { mapAuthResponse } from "@/features/auth/utils/authMappers";
import { authRepository } from "./authRepository";
import type {
  AuthResult,
  LoginFormData,
  RegisterFormData,
} from "@/features/auth/types/auth";

function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const serverMessage = error.response?.data?.error?.message;
    if (typeof serverMessage === "string") return serverMessage;
    if (error.response?.status === 409)
      return "An account with this email already exists.";
    if (error.response?.status === 401) return "Invalid email or password.";
    if (error.response?.status === 400)
      return "Please check your input and try again.";
  }
  return "An unexpected error occurred. Please try again.";
}

export const authManager = {
  async login(data: LoginFormData): Promise<AuthResult> {
    try {
      const response = await authRepository.login({
        email: data.email,
        password: data.password,
      });
      const result = mapAuthResponse(response.data);
      markAuthenticated();
      return result;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  async register(data: RegisterFormData): Promise<AuthResult> {
    try {
      const response = await authRepository.register({
        email: data.email,
        password: data.password,
        first_name: data.firstName,
        last_name: data.lastName,
        username: data.username,
        date_of_birth: data.dateOfBirth,
      });
      const result = mapAuthResponse(response.data);
      markAuthenticated();
      return result;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  async logout(): Promise<void> {
    try {
      await authRepository.logout();
    } finally {
      clearAuthenticated();
    }
  },
};
