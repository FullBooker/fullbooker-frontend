import { AuthData, User } from "@/domain/dto/output";
import type { RootModel } from ".";
import {
  getQueryParam,
  postRequest,
  purgeAnonymousAuthToken,
} from "../../utilities";
import {
  GoogleSocialSigninPayload,
  RequestOTPPayload,
  SwitchToHostPayload,
  VerifyOTPPayload,
} from "@/domain/dto/input";

import { createModel } from "@rematch/core";
import { jwtDecode, JwtPayload } from "jwt-decode";
import {
  getAnonymousAuthToken,
  getToken,
  removeToken,
  saveAnonymousAuthToken,
  saveToken,
} from "@/utilities/auth.cookie";
import { ModalID } from "@/domain/components";
import { ChangePasswordPayload } from "@/domain/auth";

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
    async initializeAnonymousAuthTokenProcurement() {
      const authThoken = getToken();
      const anonymousAuthThoken = getAnonymousAuthToken();
      if (!authThoken && !anonymousAuthThoken) {
        try {
          const response: any = await postRequest(
            "/oauth2/token/",
            {
              grant_type: "client_credentials",
              client_id: process.env.NEXT_PUBLIC_OAUTH2_CLIENT_ID,
              client_secret: process.env.NEXT_PUBLIC_OAUTH2_CLIENT_SECRET,
            },
            false,
            true
          );
          if (response && response?.data) {
            const token = response?.data?.access_token;
            saveAnonymousAuthToken(token, response?.data?.expires_in);
          }
        } catch (error: any) {
          dispatch.alert.setFailureAlert(
            error?.message || "Failed to generate anonymous auth token."
          );
        }
      }
    },
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

            purgeAnonymousAuthToken();
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
            purgeAnonymousAuthToken();
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
        dispatch.authentication.initializeAnonymousAuthTokenProcurement();
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
    async googleSocialSignin(
      credentials: GoogleSocialSigninPayload,
      rootState
    ) {
      try {
        const response: any = await postRequest(
          "/accounts/google/",
          credentials
        );

        if (response && response?.data) {
          const data: any = response?.data;
          const token = data?.access;
          const decodedJWT = jwtDecode<JwtPayload>(token);
          const jwtExpiry = new Date((decodedJWT?.exp as number) * 1000);

          if (token) {
            const currentTime = new Date().getTime();
            const expiryTime = jwtExpiry.getTime();
            const maxAge = Math.floor((expiryTime - currentTime) / 1000);

            saveToken(token, maxAge);

            localStorage.setItem("authData", JSON.stringify(data?.user));

            dispatch.authentication.setAuthStatusLoggedIn({
              user: {
                ...data?.user,
                id: data?.user?.pk,
              } as User,
            } as AuthData);
            purgeAnonymousAuthToken()
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
  }),
});
