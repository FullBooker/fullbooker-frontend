import { getAnonymousAuthToken, getToken } from "./auth.cookie";
import { store } from "../store";

export function authHeader() {
  const isLoggedIn = store.getState()?.authentication?.isLoggedIn;
  const authToken = getToken();
  const anonymousAuthToken = getAnonymousAuthToken();
  if (isLoggedIn && authToken) {
    return "Bearer " + authToken;
  } else {
    return "Bearer " + anonymousAuthToken;
  }
}
