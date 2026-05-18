const AUTH_STORAGE_KEY = "nextrade_user_isAuthenticated";
const USER_ID_STORAGE_KEY = "nextrade_current_user_id";

export function isAuthenticated(): boolean {
  return localStorage.getItem(AUTH_STORAGE_KEY) === "true";
}

export function markAuthenticated(): void {
  localStorage.setItem(AUTH_STORAGE_KEY, "true");
}

export function clearAuthenticated(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function setCurrentUserId(id: string): void {
  localStorage.setItem(USER_ID_STORAGE_KEY, id);
}

export function getCurrentUserId(): string {
  return localStorage.getItem(USER_ID_STORAGE_KEY) ?? "anon";
}

export function clearCurrentUserId(): void {
  localStorage.removeItem(USER_ID_STORAGE_KEY);
}
