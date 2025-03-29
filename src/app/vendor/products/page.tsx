"use client";

import React, { FC, useEffect, useState } from "react";
import { Dispatch, RootState } from "@/store";
import { withAuth } from "@/components/views/dash/authGuard";
import { connect } from "react-redux";
import VendorLayout from "../layout";
import { VendorProductsFilters } from "@/domain/dto/input";
import {
  ProductCategory,
  VendorProductsAPIResponse,
} from "@/domain/dto/output";
import VendorProductsListView from "@/components/vendor/products/list";

export type NewProductPageProps = {
  isProcessingRequest: boolean;
  vendorProducts: VendorProductsAPIResponse;
  productCategories: Array<ProductCategory>;
  getVendorProducts: (payload?: VendorProductsFilters) => void;
  getProductCategories: () => void;
};

const NewProductPage: FC<NewProductPageProps> & { layout: any } = ({
  isProcessingRequest,
  vendorProducts,
  productCategories,
  getVendorProducts,
  getProductCategories,
}) => {
  const [filters, setProductFilters] = useState<VendorProductsFilters>({
    page: 1,
    page_size: 10,
  });
  useEffect(() => {
    getProductCategories();
    getVendorProducts(filters);
  }, []);
  return (
    <div className="flex flex-col h-fit justify-center">
      <VendorProductsListView
        isProcessingRequest={isProcessingRequest}
        vendorProducts={vendorProducts}
        productCategories={productCategories}
        setProductFilters={setProductFilters}
      />
    </div>
  );
};

NewProductPage.layout = VendorLayout;

const mapStateToProps = (state: RootState) => {
  const isProcessingRequest = state.loading.effects.vendor.getVendorProducts;
  const { vendorProducts } = state.vendor;
  const { productCategories } = state.settings;
  return {
    isProcessingRequest,
    vendorProducts,
    productCategories,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getVendorProducts: (payload: VendorProductsFilters) =>
    dispatch.vendor.getVendorProducts(payload),
  getProductCategories: () => dispatch.settings.getProductCategories(),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAuth(NewProductPage));
