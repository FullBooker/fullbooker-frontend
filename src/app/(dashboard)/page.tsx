"use client";

import React, { FC, useEffect } from "react";
import { connect } from "react-redux";
import { RootState } from "@/store";
import "react-loading-skeleton/dist/skeleton.css";
import { ModalID } from "@/domain/components";
import { ProductCategory, ProductTag } from "@/domain/dto/output";
import ProductTags from "@/components/products/homePage/tags";
import DashBoardLayout from "./layout";
import SearchFilters from "@/components/products/homePage/productFilters";
import PopularProductsSection from "@/components/products/homePage/popularProductsSection";
import ProductsNearYouSection from "@/components/products/homePage/productsNearYou";
import ProductsRecommendeForYouSection from "@/components/products/homePage/productsRecommendeForYou";
import UpcomingProductsSection from "@/components/products/homePage/upcomingProducts";
import MoreProductsSection from "@/components/products/homePage/more";
import { Product } from "@/domain/product";
import EmptyStoreDisclaimer from "@/components/products/emptyStoreDisclaimer";

type HomePageProps = {
  getProductCategories: () => void;
  productCategories: Array<ProductCategory>;
  getCurrencies: () => void;
  productTags: Array<ProductTag>;
  getProductTags: () => void;
  products: Array<Product>;
  popularProducts: Array<Product>;
  nearByProducts: Array<Product>;
  recommendedProducts: Array<Product>;
  upcomingProducts: Array<Product>;
  isProcessingRquest: boolean;
};

const HomePage: FC<HomePageProps> & { layout: any } = ({
  getProductCategories,
  getCurrencies,
  getProductTags,
  products,
  nearByProducts,
  recommendedProducts,
  upcomingProducts,
  popularProducts,
  isProcessingRquest,
}) => {
  useEffect(() => {
    getProductCategories();
    getCurrencies();
    getProductTags();
  }, []);

  return (
    <div className="h-fit bg-white">
      {products?.length === 0 &&
      nearByProducts?.length === 0 &&
      recommendedProducts?.length === 0 &&
      upcomingProducts?.length === 0 &&
      popularProducts?.length === 0 &&
      !isProcessingRquest ? (
        <EmptyStoreDisclaimer />
      ) : (
        <div>
          <SearchFilters />

          <ProductTags />

          <PopularProductsSection />

          <ProductsNearYouSection />

          <UpcomingProductsSection />

          <ProductsRecommendeForYouSection />

          <MoreProductsSection />
        </div>
      )}
    </div>
  );
};

HomePage.layout = DashBoardLayout;

const mapStateToProps = (state: RootState) => {
  const isProcessingRquest =
    state.loading.effects.products.getProducts ||
    state.loading.effects.products.getPopularProducts ||
    state.loading.effects.products.getNearByProducts ||
    state.loading.effects.products.getNearByProducts ||
    state.loading.effects.products.getRecommendedProducts;
  const { isLoggedIn } = state.authentication;
  const {
    products,
    popularProducts,
    nearByProducts,
    recommendedProducts,
    upcomingProducts,
  } = state.products;
  const { productCategories, currencies, productTags } = state.settings;
  return {
    isLoggedIn,
    products,
    popularProducts,
    nearByProducts,
    recommendedProducts,
    upcomingProducts,
    productCategories,
    isProcessingRquest,
    currencies,
    productTags,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  setActiveModal: (modalId: ModalID) =>
    dispatch.components.setActiveModal(modalId),
  getProductCategories: () => dispatch.settings.getProductCategories(),
  getProductTags: () => dispatch.settings.getProductTags(),
  getCurrencies: () => dispatch.settings.getCurrencies(),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
