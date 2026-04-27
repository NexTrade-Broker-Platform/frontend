import type { FormErrors, LoginFormData, RegisterFormData } from "@/features/auth/types/auth";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLoginForm(data: LoginFormData): FormErrors<LoginFormData> {
  const errors: FormErrors<LoginFormData> = {};

  if (!data.email) errors.email = "Email is required.";
  else if (!EMAIL_REGEX.test(data.email)) errors.email = "Enter a valid email address.";

  if (!data.password) errors.password = "Password is required.";
  else if (data.password.length < 8) errors.password = "Password must be at least 8 characters.";

  return errors;
}

export function validateRegisterForm(data: RegisterFormData): FormErrors<RegisterFormData> {
  const errors: FormErrors<RegisterFormData> = {};

  if (!data.email) errors.email = "Email is required.";
  else if (!EMAIL_REGEX.test(data.email)) errors.email = "Enter a valid email address.";

  if (!data.password) errors.password = "Password is required.";
  else if (data.password.length < 8) errors.password = "Password must be at least 8 characters.";

  if (!data.confirmPassword) errors.confirmPassword = "Please confirm your password.";
  else if (data.password !== data.confirmPassword) errors.confirmPassword = "Passwords do not match.";

  if (!data.firstName.trim()) errors.firstName = "First name is required.";
  if (!data.lastName.trim()) errors.lastName = "Last name is required.";
  if (!data.username.trim()) errors.username = "Username is required.";

  if (!data.dateOfBirth) errors.dateOfBirth = "Date of birth is required.";
  else if (new Date(data.dateOfBirth) >= new Date()) errors.dateOfBirth = "Date of birth must be in the past.";

  return errors;
}
