import { AuthData } from "@/domain/dto/output";
import type { RootModel } from ".";
import { postRequest, putRequest } from "../../utilities";
import {
  ForgotPasswordPayload,
  ResendPhoneOTPPayload,
  ResetPasswordPayload,
  UpdatePasswordPayload,
  VerifyPhoneOTPPayload,
} from "@/domain/dto/input";

import { setCookie, parseCookies } from "nookies";
import { createModel } from "@rematch/core";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { getToken, removeToken, saveToken } from "@/utilities/auth.cookie";

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
};

export const authentication = createModel<RootModel>()({
  state: {
    isLoggedIn: getToken() ? true : false,
    authData: {},
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
  },
  effects: (dispatch: any) => ({
    async initAuth(rootState) {
      try {
        const token = getToken();
        const authData = getAuthDataFromLocalStorage();

        if (!token) {
          dispatch.authentication.setAuthStatusLoggedOut();
          throw new Error("No authentication token found");
        }

        const decodedJWT = jwtDecode<JwtPayload>(token);

        if (!decodedJWT || !decodedJWT.exp) {
          throw new Error("Invalid JWT");
        }

        const jwtExpiry = new Date((decodedJWT.exp as number) * 1000);

        if (new Date() > jwtExpiry) {
          dispatch.authentication.setAuthStatusLoggedOut();
        } else {
          dispatch.authentication.setAuthStatusLoggedIn(authData);
        }
      } catch (error) {
        console.error("Error during authentication initialization:", error);
        dispatch.authentication.setAuthStatusLoggedOut();
      }
    },
    async register(payload, rootState) {
      try {
        const response: any = await postRequest(
          "/api/v1/user/auth/register",
          payload
        );

        if (response && response?.data?.success) {
          dispatch.alert.setSuccessAlert(response?.data?.message);
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(error?.message);
      }
    },
    async signIn(credentials, rootState) {
      try {
        const response: any = await postRequest(
          "/api/v1/user/auth/login",
          credentials
        );

        if (response && response?.data?.success) {
          const data: any = response?.data?.data;
          const token = data?.token;
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
        } else {
          dispatch.alert.setFailureAlert("Incorrect password or email!");
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(error?.message);
      }
    },
    async signOut(credentials, rootState) {
      const autToken = getToken();
      try {
        dispatch.authentication.setAuthStatusLoggedOut();
        const response: any = await postRequest(
          "/api/v1/user/auth/logout",
          credentials
        );
        if (response && response?.data?.success) {
          removeToken();
          localStorage.removeItem("authData");
        } else {
          dispatch.alert.setFailureAlert(response?.data?.message);
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(error?.message);
      } finally {
        autToken && removeToken();
        localStorage.removeItem("authData");
      }
    },
    async verifyOTP(payload: VerifyPhoneOTPPayload, rootState) {
      try {
        const response: any = await postRequest(
          "/api/v1/user/auth/verify/otp",
          payload
        );
        if (response && response?.data?.success) {
          dispatch.alert.setSuccessAlert(response?.data?.message);
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(error?.message);
      }
    },
    async resendOTP(payload: ResendPhoneOTPPayload, rootState) {
      try {
        const response: any = await postRequest(
          "/api/v1/user/auth/resend/otp",
          payload
        );
        if (response && response?.data?.success) {
          dispatch.alert.setSuccessAlert(response?.data?.message);
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(error?.message);
      }
    },
    async forgotPassword(payload: ForgotPasswordPayload, rootState) {
      try {
        const response: any = await putRequest(
          "/api/v1/user/auth/reset/password/otp",
          payload
        );
        if (response && response?.data?.success) {
          dispatch.alert.setSuccessAlert(response?.data?.message);
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(error?.message);
      }
    },
    async resetPassword(payload: ResetPasswordPayload, rootState) {
      try {
        const response: any = await putRequest(
          "/api/v1/user/auth/reset/password",
          payload
        );
        if (response && response?.data?.success) {
          dispatch.alert.setSuccessAlert(response?.data?.message);
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(error?.message);
      }
    },
    async updatePassword(payload: UpdatePasswordPayload, rootState) {
      try {
        const response: any = await putRequest(
          "/api/v1/user/auth/profile/password",
          payload
        );
        if (response && response?.data?.success) {
          dispatch.alert.setSuccessAlert(response?.data?.message);
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(error?.message);
      }
    },
  }),
});
