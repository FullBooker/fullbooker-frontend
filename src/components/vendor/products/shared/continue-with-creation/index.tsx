"use client";

import { FC, useEffect, useState } from "react";
import Image from "next/image";
import { RootState } from "@/store";
import { connect } from "react-redux";

import { ModalID } from "@/domain/components";
import { KeyRound } from "lucide-react";
import { ViewType } from "@/domain/constants";
import { NewProductPayload } from "@/domain/dto/input";

type ContinueProductCreationModalContentProps = {
  setActiveModal: (modalId: ModalID) => void;
  setProductPageViewType: (viewType: ViewType) => void;
  setNewProductDetails: (payload: any) => void;
  setActiveStep: (activeStep: number) => void;
};

const ContinueProductCreationModal: FC<
  ContinueProductCreationModalContentProps
> = ({
  setActiveModal,
  setProductPageViewType,
  setNewProductDetails,
  setActiveStep,
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
    <div className="w-full max-w-md mx-auto">
      <div className="text-center">
        <Image
          src="/assets/continue.jpg"
          alt="Fullbooker Logo"
          width={isMobile ? 250 : 400}
          height={isMobile ? 250 : 400}
          className="mx-auto"
        />
        <div className="text-center items-center mb-2 flex justify-center">
          <h2 className="text font-bold">Finish Setting Up your Product</h2>
        </div>
        <div className="text-center items-center mb-2 flex justify-center">
          <p className="text-sm font-light">
            We noticed that you were in the middle of setting up your product.
            Would you like to continue where you left off or start fresh?
          </p>
        </div>
      </div>
      <div className="flex justify-between mt-4 gap-4">
        <button
          className="sm:w-full xs:w-full lg:w-[80%] md:w-[80%] w-full bg-primary text-black py-2 rounded-md"
          onClick={() => {
            setActiveModal(ModalID.none);
            setActiveStep(0);
            setNewProductDetails(null);
          }}
        >
          Cancel
        </button>
        <button
          className="sm:w-full xs:w-full lg:w-[80%] md:w-[80%] w-full bg-primary text-black py-2 rounded-md"
          onClick={() => {
            setActiveModal(ModalID.none);
            setProductPageViewType(ViewType.onboardingView);
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {};

const mapDispatchToProps = (dispatch: any) => ({
  setActiveModal: (modalId: ModalID) =>
    dispatch.components.setActiveModal(modalId),
  setProductPageViewType: (viewType: ViewType) =>
    dispatch.vendor.setProductPageViewType(viewType),
  setNewProductDetails: (payload: any) =>
    dispatch.vendor.setNewProductDetails(payload),
  setActiveStep: (activeStep: number) =>
    dispatch.vendor.setActiveStep(activeStep),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContinueProductCreationModal);
