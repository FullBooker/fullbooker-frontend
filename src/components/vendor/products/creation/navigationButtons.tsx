import Button from "@/components/shared/button";
import { ProductType } from "@/domain/constants";
import { NewProductPayload } from "@/domain/dto/input";
import { Dispatch, RootState } from "@/store";
import { CircularProgress } from "@mui/material";
import Link from "next/link";
import React, { FC } from "react";
import { connect } from "react-redux";
import { styled } from "@mui/material/styles";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";

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

  const calculateProgress = () => {
    const totalSteps = productType === ProductType.event ? 8 : 7;
    return Math.round((activeStep / totalSteps) * 100);
  };

  const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 6,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: theme.palette.grey[200],
      ...theme.applyStyles("dark", {
        backgroundColor: theme.palette.grey[800],
      }),
    },
    [`& .${linearProgressClasses.bar}`]: {
      backgroundColor: "#F55E00",
      ...theme.applyStyles("dark", {
        backgroundColor: "#308fe8",
      }),
    },
  }));

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
    <div className="fixed bottom-0 left-0 md:left-[300px] right-0 bg-white border-t border-gray-200 px-4 md:px-10">
      <div className="flex justify-between gap-10 md:gap-0 mb-6 md:mb-4 mt-6 md:mt-6 w-full">
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
      <div className="mt-4 md:mt-10 mb-4 md:mb-8">
        <BorderLinearProgress
          variant="determinate"
          value={calculateProgress()}
        />
      </div>
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
