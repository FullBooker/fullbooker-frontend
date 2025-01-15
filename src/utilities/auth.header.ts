import { getToken } from "./auth.cookie";

export function authHeader() {
  let token = getToken();
  if (token) {
    return "Bearer "+token;
  } else {
    return "";
  }
}
