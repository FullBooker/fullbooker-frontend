"use client";

import { FC, useEffect, useState } from "react";
import Image from "next/image";
import { RootState } from "@/store";
import { connect } from "react-redux";

import { ModalID } from "@/domain/components";
import { KeyRound } from "lucide-react";
import { ViewType } from "@/domain/constants";
import { NewProductPayload } from "@/domain/dto/input";

type SessionExpiredModalContentProps = {
  setActiveModal: (modalId: ModalID) => void;
  setSessionHasExpired: (sessionHasExpired: boolean) => void;
};

const SessionExpiredModal: FC<SessionExpiredModalContentProps> = ({
  setActiveModal,
  setSessionHasExpired,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="w-full max-w-md mx-auto px-0 md:px-4">
      <div className="text-center">
        <Image
          src="/assets/forbidden.jpg"
          alt="Unauthorised User"
          width={isMobile ? 250 : 400}
          height={isMobile ? 250 : 400}
          className="mx-auto"
        />
        <div className="text-center items-center mb-2 md:mb-3 mt-2 md:mt-8 flex justify-center">
          <h2 className="text-lg md:text-xl font-bold">
            Oops! Your session has session has expired
          </h2>
        </div>
        <div className="text-center items-center mb-2 md:mb-8 flex justify-center">
          <p className="text-sm md:text-lg font-light">
            Please sign in again to continue?
          </p>
        </div>
      </div>
      <div className="flex justify-between mt-4 gap-4">
        <button
          className="sm:w-full xs:w-full lg:w-[80%] md:w-[80%] w-full bg-primary text-black py-2 rounded-md"
          onClick={() => {
            setSessionHasExpired(false);
            setActiveModal(ModalID.none);
          }}
        >
          Cancel
        </button>
        <button
          className="sm:w-full xs:w-full lg:w-[80%] md:w-[80%] w-full bg-primary text-black py-2 rounded-md"
          onClick={() => {
            setSessionHasExpired(false);
            setActiveModal(ModalID.login);
          }}
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  return { state };
};

const mapDispatchToProps = (dispatch: any) => ({
  setActiveModal: (modalId: ModalID) =>
    dispatch.components.setActiveModal(modalId),
  setSessionHasExpired: (sessionHasExpired: boolean) =>
    dispatch.authentication.setSessionHasExpired(sessionHasExpired),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SessionExpiredModal);
