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
  recommendedProducts: Array<Product>;
  productCategories: Array<ProductCategory>;
  productsRequestProcessing: boolean;
  currencies: Array<Currency>;
};

const ProductsRecommededForYou: FC<PopularProductsSectionProps> = ({
  productCategories,
  recommendedProducts,
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
    <div className="py-2 lg:py-8 md:py-8 xl:py-8 px-2 md:px-3 lg:px-4 bg-white">
      <div
        className="flex justify-between items-center mb-6 py-4
          px-4 sm:px-7"
      >
        <h2 className="text-xl font-semibold">Recommended for you</h2>
      </div>
      <CategoryProductsOutlet
        products={recommendedProducts}
        currencies={currencies}
        productCategories={productCategories}
        isProcessingRequest={productsRequestProcessing}
      />
    </div>
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

const mapDispatchToProps = (dispatch: any) => ({
  getProducts: (payload?: ProductsFilters) =>
    dispatch.products.getRecommendedProducts(payload),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductsRecommededForYou);
