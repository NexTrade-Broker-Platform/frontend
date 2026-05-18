const AUTH_STORAGE_KEY = "nextrade_user_isAuthenticated";

export function isAuthenticated(): boolean {
  return localStorage.getItem(AUTH_STORAGE_KEY) === "true";
}

export function markAuthenticated(): void {
  localStorage.setItem(AUTH_STORAGE_KEY, "true");
}

export function clearAuthenticated(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}
