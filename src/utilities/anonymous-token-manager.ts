import { jwtDecode, JwtPayload } from "jwt-decode";
import { getAnonymousAuthToken } from "@/utilities/auth.cookie";

let anonymousTokenRefreshTimer: NodeJS.Timeout | null = null;

export function getAnonymousTokenExpiry(): number | null {
  const token = getAnonymousAuthToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.exp ? decoded.exp * 1000 : null;
  } catch (err) {
    return null;
  }
}

export function clearAnonymousTokenRefreshTimer() {
  if (anonymousTokenRefreshTimer) {
    clearTimeout(anonymousTokenRefreshTimer);
    anonymousTokenRefreshTimer = null;
  }
}

export function startAnonymousTokenMonitor(dispatch: any) {
  clearAnonymousTokenRefreshTimer();

  const expiry = getAnonymousTokenExpiry();
  if (!expiry) return;

  const now = Date.now();
  const timeUntilRefresh = expiry - now - 5 * 60 * 1000;

  if (timeUntilRefresh <= 0) {
    dispatch.authentication.getNewAnonymousAuthToken();
    return;
  }

  anonymousTokenRefreshTimer = setTimeout(() => {
    dispatch.authentication.getNewAnonymousAuthToken();
  }, timeUntilRefresh);
}

export const AnonymousTokenManager = {
  getAnonymousTokenExpiry,
  startAnonymousTokenMonitor,
  clearAnonymousTokenRefreshTimer,
};
