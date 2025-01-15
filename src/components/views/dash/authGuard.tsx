"use client";

import { RootState } from "@/store";
import { getToken } from "@/utilities/auth.cookie";
import { usePathname, redirect } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const AuthWrapper = (props: P) => {
    const pathname = usePathname();
    const authState = useSelector((state: RootState) => state.authentication);

    useEffect(() => {
      const token = getToken();
      if (typeof window !== "undefined" && !token) {
        return redirect(`/login?redirect=${pathname?.slice(1)}`);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authState?.isLoggedIn]);

    return <WrappedComponent {...props} />;
  };

  return AuthWrapper;
};
