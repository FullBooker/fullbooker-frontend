import Button from "@/components/shared/button";
import { ProductType } from "@/domain/constants";
import { ActivateProductPayload, NewProductPayload } from "@/domain/dto/input";
import { Dispatch, RootState } from "@/store";
import { CircularProgress } from "@mui/material";
import Link from "next/link";
import React, { FC } from "react";
import { connect } from "react-redux";

type NavigationButtonsProps = {
  isProcessingRequest: boolean;
  activeStep: number;
  setActiveStep: (step: number) => void;
  newProduct: NewProductPayload;
  isFormSubmit?: boolean;
  productType: ProductType;
  setFailureAlert: (message: string) => void;
};

const NavigationButtons: FC<NavigationButtonsProps> = ({
  isProcessingRequest,
  newProduct,
  isFormSubmit = false,
  productType,
  activeStep,
  setActiveStep,
  setFailureAlert,
}) => {
  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const backButtonProps = {
    margin: "m-0",
    borderRadius: "rounded",
    text: "text-black",
    padding: "py-1 px-4",
    isSecondary: true,
  };

  const continueButtonProps = {
    margin: "m-0",
    borderRadius: "rounded",
    text: "text-white",
    padding: "py-1 px-4",
  };

  const renderButtonContent = (title: string) => {
    return isProcessingRequest ? (
      <CircularProgress size={18} color="inherit" />
    ) : (
      title
    );
  };

  return (
    <div className="flex justify-between gap-10 md:gap-0 mb-4 md:mb-10 mt-8 md:mt-4">
      {activeStep === 0 || activeStep === 1 ? (
        <Link href={"/vendor/products"} className="w-full">
          <Button {...backButtonProps}>Back</Button>
        </Link>
      ) : (
        <Button {...backButtonProps} onClick={() => handleBack()}>
          Back
        </Button>
      )}
      {productType === ProductType.others &&
      activeStep === 5 &&
      newProduct?.pricing?.length > 0 ? (
        <Button
          {...continueButtonProps}
          disabled={isProcessingRequest}
          onClick={() => setActiveStep(activeStep + 2)}
        >
          {renderButtonContent("Continue")}
        </Button>
      ) : productType === ProductType.event &&
        activeStep === 6 &&
        newProduct?.pricing?.length > 0 ? (
        <Link href={"/vendor/products"}>
          <Button
            {...continueButtonProps}
            disabled={isProcessingRequest}
            type="button"
            onClick={() => setActiveStep(activeStep + 1)}
          >
            {renderButtonContent("Continue")}
          </Button>
        </Link>
      ) : isFormSubmit ? (
        <Button
          {...continueButtonProps}
          type="submit"
          disabled={
            isProcessingRequest ||
            (productType === ProductType.event
              ? activeStep === 6
              : activeStep === 5)
          }
        >
          {renderButtonContent("Continue")}
        </Button>
      ) : activeStep === 4 ? (
        <Button
          {...continueButtonProps}
          onClick={() => {
            if (!newProduct.image) {
              setFailureAlert("You need to upload atleast one image");
            } else {
              handleNext();
            }
          }}
          disabled={isProcessingRequest}
        >
          {renderButtonContent("Continue")}
        </Button>
      ) : activeStep === 5 ? (
        <Button
          {...continueButtonProps}
          onClick={() => {
            if (newProduct?.pricing?.length === 0) {
              setFailureAlert("You need to add atleast one pricing option");
            } else {
              handleNext();
            }
          }}
          disabled={isProcessingRequest}
        >
          {renderButtonContent("Continue")}
        </Button>
      ) : (
        <Button
          {...continueButtonProps}
          onClick={handleNext}
          disabled={
            isProcessingRequest ||
            (productType === ProductType.event
              ? activeStep === 6
              : activeStep === 5)
          }
        >
          {renderButtonContent("Continue")}
        </Button>
      )}
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const { newProduct, productType, activeStep, productMedia } = state.vendor;
  return {
    newProduct,
    productType,
    activeStep,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setActiveStep: (step: number) => dispatch.vendor.setActiveStep(step),
  setFailureAlert: (message: string) => dispatch.alert.setFailureAlert(message),
});

export default connect(mapStateToProps, mapDispatchToProps)(NavigationButtons);
