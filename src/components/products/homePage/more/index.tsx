"use client";

import React, { FC, useEffect } from "react";
import { connect } from "react-redux";
import { Dispatch, RootState } from "@/store";
import "react-loading-skeleton/dist/skeleton.css";
import { ProductsFilters } from "@/domain/dto/input";
import { Product } from "@/domain/product";
import { Currency, ProductCategory } from "@/domain/dto/output";
import CategoryProductsOutlet from "../categoryProductsOutlet";

type PopularProductsSectionProps = {
  isLoggedIn: boolean;
  getProducts: (payload?: ProductsFilters) => void;
  recommendedProducts: Array<Product>;
  productCategories: Array<ProductCategory>;
  productsRequestProcessing: boolean;
  currencies: Array<Currency>;
};

const MoreProducts: FC<PopularProductsSectionProps> = ({
  productCategories,
  recommendedProducts,
  productsRequestProcessing,
  getProducts,
  currencies,
}) => {
  useEffect(() => {
    getProducts({
      page: 1,
      page_size: 5,
    } as ProductsFilters);
  }, []);

  return (
    <CategoryProductsOutlet
      title="More"
      path="/products"
      products={recommendedProducts}
      currencies={currencies}
      productCategories={productCategories}
      isProcessingRequest={productsRequestProcessing}
    />
  );
};

const mapStateToProps = (state: RootState) => {
  const productsRequestProcessing =
    state.loading.effects.products.getRecommendedProducts;
  const { recommendedProducts } = state.products;
  const { productCategories, currencies } = state.settings;
  return {
    recommendedProducts,
    productCategories,
    productsRequestProcessing,
    currencies,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getProducts: (payload: ProductsFilters) =>
    dispatch.products.getProducts(payload),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MoreProducts);
