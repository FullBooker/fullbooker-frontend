"use client";

import React, { FC, useEffect, useState } from "react";
import { connect } from "react-redux";
import { RootState } from "@/store";
import "react-loading-skeleton/dist/skeleton.css";
import { ModalID } from "@/domain/components";
import {
  ProductCategory,
  ProductsAPIResponse,
  ProductTag,
} from "@/domain/dto/output";
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
  productCategories: Array<ProductCategory>;
  getCurrencies: () => void;
  productTags: Array<ProductTag>;
  products: ProductsAPIResponse;
  popularProducts: Array<Product>;
  nearByProducts: Array<Product>;
  recommendedProducts: Array<Product>;
  upcomingProducts: Array<Product>;
  isProcessingRquest: boolean;
  getProductCategories: () => void;
};

const HomePage: FC<HomePageProps> & { layout: any } = ({
  getCurrencies,
  products,
  nearByProducts,
  recommendedProducts,
  upcomingProducts,
  popularProducts,
  isProcessingRquest,
  getProductCategories
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    getCurrencies();
    getProductCategories();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  

  return (
    <div className="h-fit bg-white">
      <div
        className={`fixed z-50 bg-white w-full transition-shadow duration-300 ${
          isScrolled ? "shadow-md" : ""
        }`}
      >
        <SearchFilters />
        <ProductTags />
      </div>
      <div className="pt-[140px] md:pt-[200px] lg:pt-[200px]">
        {(!products || products?.results?.length === 0) &&
        (!nearByProducts || nearByProducts?.length === 0) &&
        (!recommendedProducts || recommendedProducts?.length === 0) &&
        (!upcomingProducts || upcomingProducts?.length === 0) &&
        (!popularProducts || popularProducts?.length) === 0 &&
        !isProcessingRquest ? (
          <EmptyStoreDisclaimer />
        ) : (
          <div>
            <PopularProductsSection />
            <ProductsNearYouSection />
            <UpcomingProductsSection />
            <ProductsRecommendeForYouSection />
            <MoreProductsSection />
          </div>
        )}
      </div>
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
  getCurrencies: () => dispatch.settings.getCurrencies(),
  getProductCategories: () => dispatch.settings.getProductCategories(),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
