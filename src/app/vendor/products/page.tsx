"use client";

import React, { FC, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { RootState } from "@/store";
import { withAuth } from "@/components/views/dash/authGuard";
import { connect } from "react-redux";
import VendorLayout from "../layout";
import ProductCreationIntro from "@/components/vendor/products/creation/intro";
import ProductClassification from "@/components/vendor/products/creation/classification";
import ProductLocation from "@/components/vendor/products/creation/location";
import ProductMedia from "@/components/vendor/products/creation/media";
import ProductInfo from "@/components/vendor/products/creation/description";
import ProductPricing from "@/components/vendor/products/creation/pricing";
import ProductPricingSummary from "@/components/vendor/products/creation/pricingSummary";
import ProductPublishing from "@/components/vendor/products/creation/publish";
import { styled } from "@mui/material/styles";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { NewProductPayload, VendorProductsFilters } from "@/domain/dto/input";
import { ProductCategory } from "@/domain/dto/output";
import { Product } from "@/domain/product";
import VendorProductsListView from "@/components/vendor/products/list";
import { ProductType, ViewType } from "@/domain/constants";
import { ModalID } from "@/domain/components";
import UniversalModal from "@/components/modal/UniversalModal";
import ContinueWithProductCreation from "@/components/vendor/products/shared/continue-with-creation";
import ProductDeletionConfirmation from "@/components/vendor/products/shared/deleteProductConfirmation";
import PauseProductConfirmation from "@/components/vendor/products/shared/pauseProductConfirmation";
import ActivateProductConfirmation from "@/components/vendor/products/shared/activateProductConfirmation";

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

export type NewProductPageProps = {
  newProduct: NewProductPayload;
  activeStep: number;
  setActiveStep: (payload: number) => void;
  productCategories: Array<ProductCategory>;
  getVendorProducts: (payload?: VendorProductsFilters) => void;
  productPageViewType: ViewType;
  productType: ProductType;
  getProductCategories: () => void;
  setActiveModal: (modalId: ModalID) => void;
  modalId: ModalID;
};

const NewProductPage: FC<NewProductPageProps> & { layout: any } = ({
  newProduct,
  activeStep,
  setActiveStep,
  productCategories,
  getVendorProducts,
  productPageViewType,
  productType,
  getProductCategories,
  setActiveModal,
  modalId,
}) => {
  const [filters, setFilters] = useState<VendorProductsFilters>({
    page: 1,
    limit: 10,
  });
  const { theme = "light" } = useTheme();
  const [data, setData] = useState<string | null>(null);
  const [themeMode, setThemeMode] = useState("light");

  useEffect(() => {
    setThemeMode(theme);
  }, [theme]);

  useEffect(() => {
    if (!activeStep) {
      setActiveStep(0);
    }
  }, [activeStep]);

  useEffect(() => {
    if (newProduct) {
      setActiveModal(ModalID.continueWithProductCreation);
    }
  }, []);

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
        return productType === ProductType.event ? (
          <ProductPricingSummary />
        ) : (
          <ProductPublishing />
        );
      case 7:
        return <ProductPublishing />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-fit justify-center">
      {productPageViewType === ViewType.onboardingView ? (
        <div>
          {getActiveStepContent()}
          <div className="px-2 md:px-10 mt-4 md:mt-10 mb-8 md:mb-20">
            <BorderLinearProgress
              variant="determinate"
              value={Math.round(
                (activeStep / (productType === ProductType.event ? 7 : 6)) * 100
              )}
            />
          </div>
        </div>
      ) : (
        <VendorProductsListView />
      )}
      {modalId === ModalID.continueWithProductCreation && (
        <UniversalModal
          theme={themeMode}
          open={true}
          content={<ContinueWithProductCreation />}
        />
      )}
      {modalId === ModalID.deleteProductConfirmation && (
        <UniversalModal
          theme={themeMode}
          open={true}
          content={<ProductDeletionConfirmation />}
        />
      )}
      {modalId === ModalID.pauseProductConfirmation && (
        <UniversalModal
          theme={themeMode}
          open={true}
          content={<PauseProductConfirmation />}
        />
      )}
      {modalId === ModalID.activateProductConfirmation && (
        <UniversalModal
          theme={themeMode}
          open={true}
          content={<ActivateProductConfirmation />}
        />
      )}
    </div>
  );
};

NewProductPage.layout = VendorLayout;

const mapStateToProps = (state: RootState) => {
  const { newProduct, activeStep, productPageViewType, productType } =
    state.vendor;
  const { productCategories } = state.settings;
  const { modalId } = state.components;
  return {
    newProduct,
    activeStep,
    productCategories,
    productPageViewType,
    productType,
    modalId,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  setActiveStep: (payload: number) => dispatch.vendor.setActiveStep(payload),
  getVendorProducts: (payload: VendorProductsFilters) =>
    dispatch.vendor.getVendorProducts(payload),
  getProductCategories: () => dispatch.settings.getProductCategories(),
  setActiveModal: (modalId: ModalID) =>
    dispatch.components.setActiveModal(modalId),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAuth(NewProductPage));
