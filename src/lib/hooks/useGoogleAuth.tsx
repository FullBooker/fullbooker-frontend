"use client";

import { useEffect, useState } from "react";
import {
  useGoogleLogin as googleOAuthLogin,
  useGoogleOneTapLogin,
} from "@react-oauth/google";
import { store } from "@/store";
import { GoogleSocialSigninPayload } from "@/domain/dto/input";
import { getToken, TOKEN_KEY } from "@/utilities/auth.cookie";

export const useGoogleOneTap = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(getToken());

  useEffect(() => {
    const interval = setInterval(() => {
      const currentToken = getToken();
      if (currentToken !== authToken) {
        setAuthToken(currentToken as string);
      }
    }, 500);

    setIsLoggedIn(authToken ? true : false);

    return () => clearInterval(interval);
  }, [authToken]);

  useGoogleOneTapLogin({
    onSuccess: async (tokenResponse: any) => {
      store.dispatch.authentication.googleSocialSignin({
        access_token: Array.isArray(tokenResponse?.credential)
          ? tokenResponse?.credential[0]
          : tokenResponse?.credential,
      } as GoogleSocialSigninPayload);
    },
    disabled: isLoggedIn,
  });

  return null;
};

export const useGoogleLogin = () => {
  const login = googleOAuthLogin({
    onSuccess: async (tokenResponse: any) => {
      store.dispatch.authentication.googleSocialSignin({
        access_token: Array.isArray(tokenResponse?.access_token)
          ? tokenResponse?.access_token[0]
          : tokenResponse?.access_token,
      } as GoogleSocialSigninPayload);
    },
    onError: (error) => console.error("Google Login Error:", error),
  });

  return {
    login,
  };
};
