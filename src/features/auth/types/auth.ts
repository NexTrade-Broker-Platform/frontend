export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface RegisterRequestDto {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  username: string;
  date_of_birth: string;
}

export interface AuthUserDto {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  created_at: string;
  is_active: boolean;
}

export interface AuthResponseDto {
  message?: string;
  user?: AuthUserDto;
}

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  createdAt: string;
  isActive: boolean;
}

export interface AuthResult {
  user: AuthUser | null;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  username: string;
  dateOfBirth: string;
}

export type FormErrors<T> = Partial<Record<keyof T, string>>;
