"use client";

import React, { FC, useEffect, useState } from "react";
import { connect } from "react-redux";
import { RootState } from "@/store";
import "react-loading-skeleton/dist/skeleton.css";
import SingleProduct from "@/components/products/product";
import SingleProductSkeleton from "@/components/shared/shimmers/singleProduct";
import { ProductsFilters } from "@/domain/dto/input";
import { Product } from "@/domain/product";
import { Currency, ProductCategory } from "@/domain/dto/output";
import NoRecords from "@/components/vendor/products/shared/no-records";

type ProductsOutletProps = {
  getProducts: (payload?: ProductsFilters) => void;
  getProductCategories: () => void;
  products: Array<Product>;
  productCategories: Array<ProductCategory>;
  productsRequestProcessing: boolean;
  getCurrencies: () => void;
  currencies: Array<Currency>;
  filters?: ProductsFilters;
  setFilters?: (filters: ProductsFilters) => void;
  isPopularNowProductsSection?: boolean;
  isNearbyProductsSection?: boolean;
  isUpcomingProductsSection?: boolean;
  isRecommendedForYouSection?: boolean;
  getPopularNowProducts: (payload?: ProductsFilters) => void;
  getProductsNearBy: (payload?: ProductsFilters) => void;
  getUpcomingProducts: (payload?: ProductsFilters) => void;
  getRecommendedProducts: (payload?: ProductsFilters) => void;
};

const ProductsOutlet: FC<ProductsOutletProps> = ({
  productCategories,
  products,
  productsRequestProcessing,
  getProducts,
  getProductCategories,
  getCurrencies,
  currencies,
  filters,
  setFilters,
  isPopularNowProductsSection = false,
  isNearbyProductsSection = false,
  isUpcomingProductsSection = false,
  isRecommendedForYouSection = false,
  getPopularNowProducts,
  getProductsNearBy,
  getRecommendedProducts,
  getUpcomingProducts,
}) => {
  useEffect(() => {
    getProductCategories();
    getCurrencies();
    if (isPopularNowProductsSection) {
      getPopularNowProducts(filters);
    } else if (isNearbyProductsSection) {
      getProductsNearBy(filters);
    } else if (isUpcomingProductsSection) {
      getUpcomingProducts(filters);
    } else if (isRecommendedForYouSection) {
      getRecommendedProducts(filters);
    } else {
      getProducts(filters);
    }
  }, []);

  return (
    <div className="flex flex-col h-fit bg-gray-100">
      <div className="py-2 lg:py-8 md:py-8 xl:py-8 px-2 md:px-3 lg:px-4 bg-white">
        {productsRequestProcessing ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 py-0
            px-4 md:px-7"
          >
            {Array(10)
              .fill(null)
              .map((_, index) => (
                <SingleProductSkeleton key={index} />
              ))}
          </div>
        ) : (
          <div>
            {products && products?.length === 0 ? (
              <NoRecords message="Oops! There are no products in this category at the moment" />
            ) : (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 py-0
px-4 md:px-7"
              >
                {products?.map((product: Product, index: number) => (
                  <SingleProduct
                    key={index}
                    product={product}
                    currencies={currencies}
                    categories={productCategories}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState, ownProps: ProductsOutletProps) => {
  const productsRequestProcessing = state.loading.models.products;
  const {
    products,
    nearByProducts,
    popularProducts,
    upcomingProducts,
    recommendedProducts,
  } = state.products;
  const { productCategories, currencies } = state.settings;

  let displayedProducts = products?.results;

  if (ownProps.isPopularNowProductsSection) {
    displayedProducts = popularProducts;
  } else if (ownProps.isNearbyProductsSection) {
    displayedProducts = nearByProducts;
  } else if (ownProps.isUpcomingProductsSection) {
    displayedProducts = upcomingProducts;
  } else if (ownProps.isRecommendedForYouSection) {
    displayedProducts = recommendedProducts;
  }

  return {
    products: displayedProducts,
    productCategories,
    productsRequestProcessing,
    currencies,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  getProducts: (payload?: ProductsFilters) =>
    dispatch.products.getProducts(payload),
  getProductCategories: () => dispatch.settings.getProductCategories(),
  getCurrencies: () => dispatch.settings.getCurrencies(),
  getPopularNowProducts: (payload?: ProductsFilters) =>
    dispatch.products.getPopularProducts(payload),
  getProductsNearBy: (payload?: ProductsFilters) =>
    dispatch.products.getNearByProducts(payload),
  getUpcomingProducts: (payload?: ProductsFilters) =>
    dispatch.products.getUpcomingProducts(payload),
  getRecommendedProducts: (payload?: ProductsFilters) =>
    dispatch.products.getRecommendedProducts(payload),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductsOutlet);
