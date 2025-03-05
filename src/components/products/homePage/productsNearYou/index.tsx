"use client";

import React, { FC, useEffect } from "react";
import { connect } from "react-redux";
import { RootState } from "@/store";
import "react-loading-skeleton/dist/skeleton.css";
import { ProductsFilters } from "@/domain/dto/input";
import { Product } from "@/domain/product";
import { Currency, ProductCategory } from "@/domain/dto/output";
import CategoryProductsOutlet from "../categoryProductsOutlet";

type PopularProductsSectionProps = {
  isLoggedIn: boolean;
  getProducts: (payload?: ProductsFilters) => void;
  nearByProducts: Array<Product>;
  productCategories: Array<ProductCategory>;
  productsRequestProcessing: boolean;
  currencies: Array<Currency>;
};

const ProductsNearYouSection: FC<PopularProductsSectionProps> = ({
  productCategories,
  nearByProducts,
  productsRequestProcessing,
  getProducts,
  currencies,
}) => {
  useEffect(() => {
    getProducts({
      page: 1,
      page_size: 10,
    } as ProductsFilters);
  }, []);

  return (
    <CategoryProductsOutlet
      title="Near you"
      path="/products/nearby"
      products={nearByProducts}
      currencies={currencies}
      productCategories={productCategories}
      isProcessingRequest={productsRequestProcessing}
    />
  );
};

const mapStateToProps = (state: RootState) => {
  const productsRequestProcessing =
    state.loading.effects.products.getNearByProducts;
  const { nearByProducts } = state.products;
  const { productCategories, currencies } = state.settings;
  return {
    nearByProducts,
    productCategories,
    productsRequestProcessing,
    currencies,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  getProducts: (payload?: ProductsFilters) =>
    dispatch.products.getNearByProducts(payload),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductsNearYouSection);
