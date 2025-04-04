import axios from "axios";
import { authHeader } from "./auth.header";
import { store } from "../store";
import { NotFoundError, TechnicalError } from "./errors";
import { ModalID } from "@/domain/components";
import { getAnonymousAuthToken } from "./auth.cookie";
let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

const publicApiEndpoints = [
  "/accounts/otp/request",
  "/accounts/otp/verify",
  "/accounts/password/reset",
  "/accounts/google/",
  "/accounts/signup/",
  "/accounts/signin/",
  "/oauth2/token/",
  "/accounts/password/reset",
];

const isPublic = (url: string) => {
  return publicApiEndpoints.includes(url);
};

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
  withCredentials: false,
});

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401) {
      const state = store.getState();

      if (state?.authentication?.isLoggedIn) {
        store.dispatch.components.setActiveModal(ModalID.login);
        return Promise.reject(error);
      }

      if (!isRefreshing) {
        isRefreshing = true;
        store.dispatch.components.setActiveModal(ModalID.sessionExpired);
        refreshPromise = store.dispatch.authentication
          .getNewAnonymousAuthToken()
          .finally(() => {
            isRefreshing = false;
          });
      }

      try {
        await refreshPromise;
        return;
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 500) {
      return Promise.reject(new TechnicalError(error.response?.data));
    } else if (error.response?.status === 404) {
      return Promise.reject(new NotFoundError(error.response?.data));
    }

    return Promise.reject({
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      data: error.response?.data,
    });
  }
);

export const axiosRequests = {
  getRequest,
  postRequest,
  patchRequest,
  putRequest,
};

export async function getRequest(URL: string) {
  const response = await axiosClient.get(URL, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(authHeader() && !isPublic(URL)
        ? { Authorization: authHeader() }
        : {}),
    },
  });
  return response;
}

export async function postRequest(
  URL: string,
  payload: any,
  hasFile?: boolean,
  isOauth2TokenRequest?: boolean
) {
  const requestPayload = isOauth2TokenRequest
    ? new URLSearchParams({
        ...payload,
        client_id: payload.client_id,
        client_secret: payload.client_secret,
      })
    : payload;

  const response = await axiosClient.post(URL, requestPayload, {
    headers: {
      "Content-Type": isOauth2TokenRequest
        ? "application/x-www-form-urlencoded"
        : hasFile
        ? "multipart/form-data"
        : "application/json",
      Accept: "application/json",
      ...(authHeader() && !isPublic(URL)
        ? { Authorization: authHeader() }
        : {}),
    },
  });
  return response;
}

export async function patchRequest(
  URL: string,
  payload: any,
  hasFile?: boolean
) {
  const response = await axiosClient.patch(URL, payload, {
    headers: {
      "Content-Type": hasFile ? "multipart/form-data" : "application/json",
      Accept: "application/json",
      ...(authHeader() && !isPublic(URL)
        ? { Authorization: authHeader() }
        : {}),
    },
  });
  return response;
}

export async function putRequest(URL: string, payload: any) {
  const response = await axiosClient.put(URL, payload, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(authHeader() && !isPublic(URL)
        ? { Authorization: authHeader() }
        : {}),
    },
  });
  return response;
}

export async function deleteRequest(URL: string) {
  const response = await axiosClient.delete(URL, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(authHeader() && !isPublic(URL)
        ? { Authorization: authHeader() }
        : {}),
    },
  });
  return response;
}
