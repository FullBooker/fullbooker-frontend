"use client";

import { RootState } from "@/store";
import { getToken, TOKEN_KEY } from "@/utilities/auth.cookie";
import { usePathname, redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Cookies from "js-cookie";

export const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const AuthWrapper = (props: P) => {
    const pathname = usePathname();
    const authState = useSelector((state: RootState) => state.authentication);
    const dispatch = useDispatch();
    const [authToken, setAuthToken] = useState<string | null>(getToken());

    useEffect(() => {
      const interval = setInterval(() => {
        const currentToken = Cookies.get(TOKEN_KEY);
        if (currentToken !== authToken) {
          setAuthToken(currentToken as string);
        }

        if (!currentToken && authState?.isLoggedIn) {
          dispatch.authentication.signOut();
        }
      }, 500);

      return () => clearInterval(interval);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authToken, authState?.isLoggedIn]);

    useEffect(() => {
      const token = getToken();
      if (typeof window !== "undefined" && !token) {
        return redirect(`/?redirect=${pathname?.slice(1)}`);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authState?.isLoggedIn, authToken]);

    return <WrappedComponent {...props} />;
  };

  return AuthWrapper;
};
