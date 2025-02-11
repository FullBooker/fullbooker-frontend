import { ProductType, ViewType } from "@/domain/constants";
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
  setProductPageViewType: (viewType: ViewType) => void;
  setNewProductDetails: (payload: any) => void;
  setProductType: (payload: ProductType) => void;
};

const NavigationButtons: FC<NavigationButtonsProps> = ({
  loading,
  activeStep,
  setActiveStep,
  newProduct,
  disableNext,
  productCategories,
  productType,
  setProductPageViewType,
  setNewProductDetails,
  setProductType
}) => {
  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const publishProduct = () => {
    handleNext()
    // setNewProductDetails(null);
    // setProductType(ProductType.default)
    // setProductPageViewType(ViewType.productsListView);
    // setActiveStep(a);
  };

  return (
    <div className="flex justify-between gap-10 md:gap-0 mb-4 md:mb-10 mt-8 md:mt-4">
      <button
        type="button"
        className="sm:w-full xs:w-full lg:w-[10%] md:w-[20%] w-full bg-secondary text-black py-2 rounded-md mb-2 font-medium"
        onClick={() =>
          activeStep === 0
            ? setProductPageViewType(ViewType.productsListView)
            : handleBack()
        }
      >
        Back
      </button>
      {productType === ProductType.others &&
      activeStep === 5 &&
      newProduct?.pricing?.length > 0 ? (
        <button
          type="submit"
          className="sm:w-full xs:w-full lg:w-[10%] md:w-[20%] w-full bg-primary text-black py-2 rounded-md mb-2 font-medium"
          disabled={loading}
          onClick={() => publishProduct()}
        >
          {loading ? <CircularProgress size={18} color="inherit" /> : "Publish"}
        </button>
      ) : productType === ProductType.event &&
        activeStep === 6 &&
        newProduct?.pricing?.length > 0 ? (
        <button
          type="submit"
          className="sm:w-full xs:w-full lg:w-[10%] md:w-[20%] w-full bg-primary text-black py-2 rounded-md mb-2 font-medium"
          disabled={loading}
          onClick={() => publishProduct()}
        >
          {loading ? <CircularProgress size={18} color="inherit" /> : "Publish"}
        </button>
      ) : (
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
          {loading ? (
            <CircularProgress size={18} color="inherit" />
          ) : (
            "Continue"
          )}
        </button>
      )}
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
  setProductPageViewType: (viewType: ViewType) =>
    dispatch.vendor.setProductPageViewType(viewType),
  setNewProductDetails: (payload: any) =>
    dispatch.vendor.setNewProductDetails(payload),
  setProductType: (payload: ProductType) => dispatch.vendor.setProductType(payload),
});

export default connect(mapStateToProps, mapDispatchToProps)(NavigationButtons);
