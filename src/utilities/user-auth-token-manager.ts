import { jwtDecode, JwtPayload } from "jwt-decode";
import { getToken } from "@/utilities/auth.cookie";
import { ModalID } from "@/domain/components";

let userTokenRefreshTimer: NodeJS.Timeout | null = null;

export function getUserTokenExpiry(): number | null {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.exp ? decoded.exp * 1000 : null;
  } catch (err) {
    return null;
  }
}

export function clearUserTokenRefreshTimer() {
  if (userTokenRefreshTimer) {
    clearTimeout(userTokenRefreshTimer);
    userTokenRefreshTimer = null;
  }
}

export function startUserTokenMonitor(dispatch: any) {
  clearUserTokenRefreshTimer();

  const expiry = getUserTokenExpiry();
  if (!expiry) return;

  const now = Date.now();
  const timeUntilRefresh = expiry - now - 5 * 60 * 1000;

  if (timeUntilRefresh <= 0) {
    dispatch.components.setActiveModal(ModalID.login);
    return;
  }

  userTokenRefreshTimer = setTimeout(() => {
    dispatch.components.setActiveModal(ModalID.login);
  }, timeUntilRefresh);
}

export const UserTokenManager = {
  getUserTokenExpiry,
  startUserTokenMonitor,
  clearUserTokenRefreshTimer,
};
