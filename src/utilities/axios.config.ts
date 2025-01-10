import axios from "axios";
import { authHeader } from "./auth.header";
import { store } from "../store";
// const { dispatch } = store;

//Create axios instance
const axiosClient = axios.create({
  baseURL: process.env.NEXT_API_BASE_URL || "https://stagingv1.api.mowinbet.com",
  timeout: 10000,
  withCredentials: false,
});

//Intercept the request for error handling
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      // store.dispatch({ type: "authentication/signOut", payload: {} });
      // store.dispatch({ type: "alert/setFailureAlert", payload: "Session expired!" });
      return;
    } else {
      return Promise.reject(error);
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
  const response = await axiosClient.get(
    URL,
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: authHeader(),
      },
    }
  );
  return response;
}

export async function postRequest(URL: string, payload: any) {
  const response = await axiosClient.post(
    URL,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: authHeader(),
      },
    }
  );
  return response;
}

export async function patchRequest(URL: string, payload: any) {
  const response = await axiosClient.patch(
    URL,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: authHeader(),
      },
    }
  );
  return response;
}

export async function putRequest(URL: string, payload: any) {
  const response = await axiosClient.put(
    URL,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: authHeader(),
      },
    }
  );
  return response;
}

export async function deleteRequest(URL: string) {
  const response = await axiosClient.delete(
    URL,
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: authHeader(),
      },
    }
  );
  return response;
}
