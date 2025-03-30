import React, { FC, useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { RootState } from "@/store";
import CircularProgress from "@mui/material/CircularProgress";
import Image from "next/image";
import useIsMobile from "@/lib/hooks/useIsMobile";
import { getAnonymousAuthToken, getToken } from "@/utilities";

type AuthProviderProps = {
  children: any;
  isProcessingRequest: boolean;
  initializeAnonymousAuthTokenProcurement: () => void;
};

const AuthProvider: FC<AuthProviderProps> = ({
  children,
  isProcessingRequest,
  initializeAnonymousAuthTokenProcurement,
}) => {
  const dispatch = useDispatch();
  const isMobile = useIsMobile();
  const authToken = getToken();
  const anonymousToken = getAnonymousAuthToken();
  const [authTokenIsAvailable, setAuthTokenAvailability] = useState<boolean>(
    authToken || anonymousToken ? true : false
  );

  useEffect(() => {
    if (!authToken && !anonymousToken) {
      initializeAnonymousAuthTokenProcurement();
    } else {
      setAuthTokenAvailability(true);
    }
  }, [dispatch, authToken, anonymousToken]);

  const centerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  };

  if (!authTokenIsAvailable || isProcessingRequest)
    return (
      <div style={centerStyle}>
        <div className="text-center">
          <Image
            src={"/assets/logo.svg"}
            width={isMobile ? 200 : 250}
            height={isMobile ? 200 : 250}
            alt="Fullbooker Logo"
          />
          <CircularProgress
            style={{
              color: "#FC8135",
            }}
          />
        </div>
      </div>
    );

  return <div>{children}</div>;
};

const mapStateToProps = (state: RootState) => {
  const isProcessingRequest =
    state.loading.effects.authentication
      .initializeAnonymousAuthTokenProcurement;
  return {
    isProcessingRequest,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  initializeAnonymousAuthTokenProcurement: () =>
    dispatch.authentication.initializeAnonymousAuthTokenProcurement(),
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthProvider);
