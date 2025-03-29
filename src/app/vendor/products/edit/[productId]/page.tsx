"use client";

import React, { FC, useEffect } from "react";
import { Dispatch, RootState } from "@/store";
import { withAuth } from "@/components/views/dash/authGuard";
import { connect } from "react-redux";
import VendorLayout from "../../../layout";
import ProductCreationIntro from "@/components/vendor/products/creation/intro";
import ProductClassification from "@/components/vendor/products/creation/classification";
import ProductLocation from "@/components/vendor/products/creation/availability";
import ProductMedia from "@/components/vendor/products/creation/media";
import ProductInfo from "@/components/vendor/products/creation/description";
import ProductPricing from "@/components/vendor/products/creation/pricing";
import ProductPricingSummary from "@/components/vendor/products/creation/pricingSummary";
import ProductPublishing from "@/components/vendor/products/creation/publish";
import { ProductType } from "@/domain/constants";
import { ModalID } from "@/domain/components";
import UniversalModal from "@/components/layout/modal/UniversalModal";
import ContinueWithProductCreation from "@/components/vendor/products/shared/continue-with-creation";
import ProductDeletionConfirmation from "@/components/vendor/products/shared/deleteProductConfirmation";
import PauseProductConfirmation from "@/components/vendor/products/shared/pauseProductConfirmation";
import ActivateProductConfirmation from "@/components/vendor/products/shared/activateProductConfirmation";
import { NewProductPayload } from "@/domain/dto/input";
import { useSearchParams } from "next/navigation";
import { productProfileSteps } from "@/constants";


export type NewProductPageProps = {
  productType: ProductType;
  modalId: ModalID;
  setNewProductDetails: (payload: NewProductPayload | null) => void;
  setProductType: (payload: ProductType) => void;
  activeStep: number;
  setActiveStep: (payload: number) => void;
  getVendorProductById: (productId: string) => void;
  params: {
    productId: string;
  };
};

const NewProductPage: FC<NewProductPageProps> & { layout: any } = ({
  productType,
  modalId,
  setActiveStep,
  setNewProductDetails,
  setProductType,
  activeStep,
  getVendorProductById,
  params,
}) => {
  const searchParams = useSearchParams();
  const getActiveStepContent = () => {
    switch (activeStep) {
      case 0:
        return <ProductCreationIntro />;
      case 1:
        return <ProductClassification />;
      case 2:
        return <ProductInfo />;
      case 3:
        return <ProductLocation />;
      case 4:
        return <ProductMedia />;
      case 5:
        return <ProductPricing />;
      case 6:
        return <ProductPricingSummary />;
      case 7:
        return <ProductPublishing />;
      default:
        return null;
    }
  };

  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    const stepKey = productProfileSteps.find(
      (productProfileStep: { key: string; step: number }) =>
        productProfileStep.step === activeStep
    )?.key;
    newSearchParams.set("step", stepKey || "classification");
    window.history.replaceState({}, "", `?${newSearchParams.toString()}`);
  }, [activeStep]);

  useEffect(() => {
    const currentStepParam = searchParams.get("step");
    if (!currentStepParam) {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set("step", "classification");
      window.history.replaceState({}, "", `?${newSearchParams.toString()}`);
      setActiveStep(1);
    }
  }, []);

  useEffect(() => {
    if (params?.productId) {
      getVendorProductById(params?.productId);
    }
  }, [params?.productId]);

  useEffect(() => {
    return () => {
      setNewProductDetails(null);
      setProductType(ProductType.default);
      setActiveStep(1);
    };
  }, []);

  return (
    <div className="flex flex-col h-fit justify-center">
      <div className="h-screen px-4 mb-[150px]">{getActiveStepContent()}</div>
      {modalId === ModalID.continueWithProductCreation && (
        <UniversalModal open={true} content={<ContinueWithProductCreation />} />
      )}
      {modalId === ModalID.deleteProductConfirmation && (
        <UniversalModal open={true} content={<ProductDeletionConfirmation />} />
      )}
      {modalId === ModalID.pauseProductConfirmation && (
        <UniversalModal open={true} content={<PauseProductConfirmation />} />
      )}
      {modalId === ModalID.activateProductConfirmation && (
        <UniversalModal open={true} content={<ActivateProductConfirmation />} />
      )}
    </div>
  );
};

NewProductPage.layout = VendorLayout;

const mapStateToProps = (state: RootState) => {
  const { productType, activeStep } = state.vendor;
  const { modalId } = state.components;
  return {
    modalId,
    productType,
    activeStep,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setActiveStep: (step: number) => dispatch.vendor.setActiveStep(step),
  setNewProductDetails: (payload: NewProductPayload | null) =>
    dispatch.vendor.setNewProductDetails(payload),
  setProductType: (payload: ProductType) =>
    dispatch.vendor.setProductType(payload),
  getVendorProductById: (productId: string) =>
    dispatch.vendor.getVendorProductById(productId),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAuth(NewProductPage));
