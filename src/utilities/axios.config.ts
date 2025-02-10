import axios from "axios";
import { authHeader } from "./auth.header";
import { store } from "../store";
import { ModalID } from "@/domain/components";

//Create axios instance
const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
  withCredentials: false,
});

//Intercept the request for error handling
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      store.dispatch.authentication.signOut({});
      store.dispatch.authentication.setSessionHasExpired(true);
      store.dispatch.components.setActiveModal(ModalID.sessionExpired);
      return;
    } else {
      return Promise.reject({
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        data: error.response?.data,
      });
    }
  }
);

export const axiosRequests = {
  getRequest,
  postRequest,
  patchRequest,
  putRequest,
};

//Set up axios verbs
export async function getRequest(URL: string) {
  const response = await axiosClient.get(URL, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: authHeader(),
    },
  });
  return response;
}

export async function postRequest(
  URL: string,
  payload: any,
  hasFile?: boolean
) {
  const response = await axiosClient.post(URL, payload, {
    headers: {
      "Content-Type": hasFile ? "multipart/form-data" : "application/json",
      Accept: "application/json",
      Authorization: authHeader(),
    },
  });
  return response;
}

export async function patchRequest(URL: string, payload: any) {
  const response = await axiosClient.patch(URL, payload, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: authHeader(),
    },
  });
  return response;
}

export async function putRequest(URL: string, payload: any) {
  const response = await axiosClient.put(URL, payload, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: authHeader(),
    },
  });
  return response;
}

export async function deleteRequest(URL: string) {
  const response = await axiosClient.delete(URL, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: authHeader(),
    },
  });
  return response;
}
