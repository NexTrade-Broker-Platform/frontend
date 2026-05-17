const KEY = "isAdminAuthenticated";

export function isAdminAuthenticated(): boolean {
  return localStorage.getItem(KEY) === "true";
}

export function markAdminAuthenticated(): void {
  localStorage.setItem(KEY, "true");
}

export function clearAdminAuthenticated(): void {
  localStorage.removeItem(KEY);
}
