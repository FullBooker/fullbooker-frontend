import { ProductType } from "@/domain/constants";
import { NewProductPayload } from "@/domain/dto/input";
import { ProductCategory } from "@/domain/dto/output";
import { RootState } from "@/store";
import { CircularProgress } from "@mui/material";
import React, { FC, useEffect } from "react";
import { connect } from "react-redux";

type NavigationButtonsProps = {
  loading: boolean;
  activeStep: number;
  setActiveStep: (payload: number) => void;
  newProduct: NewProductPayload;
  disableNext?: boolean;
  productCategories: Array<ProductCategory>;
  productType: ProductType;
};

const NavigationButtons: FC<NavigationButtonsProps> = ({
  loading,
  activeStep,
  setActiveStep,
  newProduct,
  disableNext,
  productCategories,
  productType,
}) => {
  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };
  return (
    <div className="flex justify-between gap-10 md:gap-0 mb-4 md:mb-10">
      <button
        type="button"
        className="sm:w-full xs:w-full lg:w-[10%] md:w-[20%] w-full bg-secondary text-black py-2 rounded-md mb-2 font-medium"
        onClick={() => handleBack()}
        disabled={activeStep === 0}
      >
        Back
      </button>
      <button
        type="submit"
        className="sm:w-full xs:w-full lg:w-[10%] md:w-[20%] w-full bg-primary text-black py-2 rounded-md mb-2 font-medium"
        disabled={
          loading ||
          (productType === ProductType.event
            ? activeStep === 6
            : activeStep === 5)
        }
        onClick={() => (disableNext ? {} : handleNext())}
      >
        {loading ? <CircularProgress size={18} color="inherit" /> : "Continue"}
      </button>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const loading = state.loading.models.vendor;
  const { activeStep, newProduct, productType } = state.vendor;
  const { productCategories } = state.settings;
  return {
    loading,
    activeStep,
    newProduct,
    productCategories,
    productType,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  setActiveStep: (payload: number) => dispatch.vendor.setActiveStep(payload),
});

export default connect(mapStateToProps, mapDispatchToProps)(NavigationButtons);
