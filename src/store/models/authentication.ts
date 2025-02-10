import { AuthData } from "@/domain/dto/output";
import type { RootModel } from ".";
import { getQueryParam, postRequest, putRequest } from "../../utilities";
import {
  ForgotPasswordPayload,
  RequestOTPPayload,
  ResendPhoneOTPPayload,
  ResetPasswordPayload,
  SwitchToHostPayload,
  UpdatePasswordPayload,
  VerifyOTPPayload,
  VerifyPhoneOTPPayload,
} from "@/domain/dto/input";

import { setCookie, parseCookies } from "nookies";
import { createModel } from "@rematch/core";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { getToken, removeToken, saveToken } from "@/utilities/auth.cookie";
import { ModalID } from "@/domain/components";
import { ChangePasswordPayload } from "@/domain/auth";

// Function to retrieve auth data from localStorage
const getAuthDataFromLocalStorage = () => {
  try {
    const authData = localStorage.getItem("authData");
    return authData ? JSON.parse(authData) : null;
  } catch (error) {
    console.error("Error while retrieving auth data from localStorage:", error);
    return null;
  }
};

type Authentication = {
  isLoggedIn: boolean;
  authData: AuthData | any;
  identifierToBeVerified: string;
  sessionHasExpired: boolean;
};

export const authentication = createModel<RootModel>()({
  state: {
    isLoggedIn: getToken() ? true : false,
    authData: {},
    identifierToBeVerified: "",
    sessionHasExpired: false,
  } as Authentication,
  reducers: {
    setAuthStatusLoggedIn(state: Authentication, user: any) {
      return {
        ...state,
        isLoggedIn: true,
        authData: user,
      };
    },
    setAuthStatusLoggedOut(state: Authentication) {
      return {
        ...state,
        isLoggedIn: false,
        authData: {},
      };
    },
    setIdentifierToBeVerified(state: Authentication, identifier: string) {
      return {
        ...state,
        identifierToBeVerified: identifier,
      };
    },
    setSessionHasExpired(state: Authentication, sessionHasExpired: boolean) {
      return {
        ...state,
        sessionHasExpired,
      };
    },
  },
  effects: (dispatch: any) => ({
    async register(payload, rootState) {
      try {
        const response: any = await postRequest("/accounts/signup/", payload);
        if (response && response?.data?.user) {
          const data: any = response?.data;
          const token = data?.access_token;
          const decodedJWT = jwtDecode<JwtPayload>(token);
          const jwtExpiry = new Date((decodedJWT?.exp as number) * 1000);

          if (token) {
            const currentTime = new Date().getTime();
            const expiryTime = jwtExpiry.getTime();
            const maxAge = Math.floor((expiryTime - currentTime) / 1000);

            saveToken(token, maxAge);

            localStorage.setItem("authData", JSON.stringify(data?.user));

            dispatch.authentication.setAuthStatusLoggedIn({
              user: data?.user,
            } as AuthData);
          }
          dispatch.alert.setSuccessAlert(response?.data?.message);
          dispatch.components.setActiveModal(ModalID.none);
          const flow = getQueryParam("user_flow");
          if (flow && flow === "vendor") {
            dispatch.authentication.switchToHost({
              user: data?.user?.id,
            } as SwitchToHostPayload);
          }
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(
          error?.data?.detail ||
            error?.data?.email ||
            error?.data?.phone_number ||
            error?.data?.message ||
            error?.data?.password
        );
      }
    },
    async signIn(credentials, rootState) {
      try {
        const response: any = await postRequest(
          "/accounts/signin/",
          credentials
        );

        if (response && response?.data) {
          const data: any = response?.data;
          const token = data?.access_token;
          const decodedJWT = jwtDecode<JwtPayload>(token);
          const jwtExpiry = new Date((decodedJWT?.exp as number) * 1000);

          if (token) {
            const currentTime = new Date().getTime();
            const expiryTime = jwtExpiry.getTime();
            const maxAge = Math.floor((expiryTime - currentTime) / 1000);

            saveToken(token, maxAge);

            localStorage.setItem("authData", JSON.stringify(data?.user));

            dispatch.authentication.setAuthStatusLoggedIn({
              user: data?.user,
            } as AuthData);
            dispatch.alert.setSuccessAlert(
              response?.data?.message || "Login successful!"
            );
            dispatch.components.setActiveModal(ModalID.none);
            const flow = getQueryParam("user_flow");
            if (flow && flow === "vendor") {
              dispatch.authentication.switchToHost({
                user: data?.user?.id,
              } as SwitchToHostPayload);
            }
          }
        } else {
          dispatch.alert.setFailureAlert("Incorrect password or email!");
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(
          error?.data?.non_field_errors?.[0] || error?.message
        );
      }
    },
    async signOut(credentials, rootState) {
      const autToken = getToken();
      try {
        dispatch.authentication.setAuthStatusLoggedOut();
        // const response: any = await postRequest(
        //   "/api/v1/user/auth/logout",
        //   credentials
        // );
        // if (response && response?.data?.success) {
        removeToken();
        localStorage.removeItem("authData");
        // } else {
        //   dispatch.alert.setFailureAlert(response?.data?.message);
        // }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(error?.message);
      } finally {
        autToken && removeToken();
        localStorage.removeItem("authData");
      }
    },
    async requestOTP(payload: RequestOTPPayload, rootState) {
      try {
        const response: any = await postRequest(
          "/accounts/otp/request",
          payload
        );
        if (response && response?.data) {
          dispatch.authentication.setIdentifierToBeVerified(
            payload?.identifier
          );
          dispatch.alert.setSuccessAlert(
            response?.data?.detail || "OTP sent successfully!"
          );
          dispatch.components.setActiveModal(
            payload?.otp_method === "email"
              ? ModalID.emailOTPVerification
              : ModalID.phoneOTPVerification
          );
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(
          error?.data?.identifier[0] || error?.message
        );
      }
    },
    async verifyOTP(payload: VerifyOTPPayload, rootState) {
      try {
        const response: any = await postRequest(
          "/accounts/otp/verify",
          payload
        );
        if (response && response?.data) {
          dispatch.alert.setSuccessAlert(
            response?.data?.detail || "OTP verified successfully!"
          );
          dispatch.components.setActiveModal(ModalID.changePassword);
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(
          error?.data?.non_field_errors || error?.message
        );
      }
    },
    async resetPassword(payload: ChangePasswordPayload, rootState) {
      try {
        const response: any = await postRequest(
          "/accounts/password/reset",
          payload
        );
        if (response && response?.data) {
          dispatch.alert.setSuccessAlert(
            response?.data?.detail || "Password reset successfully!"
          );
          dispatch.components.setActiveModal(ModalID.passwordResetSuccessfull);
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(error?.message);
      }
    },
    async switchToHost(payload: SwitchToHostPayload, rootState) {
      try {
        const response: any = await postRequest("/hosts/", payload);
        if (response && response?.data) {
          dispatch.vendor.setVendorDetails(response?.data);
          dispatch.alert.setSuccessAlert("Switched to hosting successfully!");
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(
          error?.data?.non_field_errors || error?.message
        );
      }
    },
  }),
});
