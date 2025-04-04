"use client";

import { FC } from "react";
import { RootState } from "@/store";
import { connect } from "react-redux";

import { ModalID } from "@/domain/components";
import Button from "@/components/shared/button";
import CircularProgress from "@mui/material/CircularProgress";

type SessionExpiredModalContentProps = {
  retrievingNewAnonymousAuthTokenRequestProcessing: boolean;
  setActiveModal: (modalId: ModalID) => void;
  setSessionHasExpired: (sessionHasExpired: boolean) => void;
  getNewAnonymousAuthToken: () => void;
};

const SessionExpiredModal: FC<SessionExpiredModalContentProps> = ({
  getNewAnonymousAuthToken,
  retrievingNewAnonymousAuthTokenRequestProcessing,
}) => {

  return (
    <div className="w-full max-w-md mx-auto px-0 md:px-4">
      <div className="text-center">
        <div className="text-center items-center mb-2 md:mb-3 mt-2 md:mt-8 flex justify-center">
          <h2 className="text-lg md:text-xl font-bold">
            Refreshing Your Session
          </h2>
        </div>
        <div className="text-center items-center mb-2 md:mb-8 flex justify-center">
          <p className="text-sm md:text-lg font-light">
            Hang tight — we're securely refreshing your session. You’ll be back
            in a moment.
          </p>
        </div>
      </div>
      <div className="flex justify-between mt-4 gap-4">
        <Button
          width="w-full"
          bg="bg-primary"
          borderRadius="rounded"
          text="text-white font-base"
          padding="py-3"
          margin="mb-2"
          onClick={() => getNewAnonymousAuthToken()}
        >
          {retrievingNewAnonymousAuthTokenRequestProcessing ? (
            <CircularProgress size={18} color="inherit" />
          ) : (
            "Refresh"
          )}
        </Button>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const retrievingNewAnonymousAuthTokenRequestProcessing =
    state.loading.effects.authentication.getNewAnonymousAuthToken;
  return { retrievingNewAnonymousAuthTokenRequestProcessing };
};

const mapDispatchToProps = (dispatch: any) => ({
  getNewAnonymousAuthToken: () =>
    dispatch.authentication.getNewAnonymousAuthToken(),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SessionExpiredModal);
