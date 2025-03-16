"use client";

import React, { FC, useEffect } from "react";
import { connect } from "react-redux";
import { RootState } from "@/store";
import "react-loading-skeleton/dist/skeleton.css";
import { ModalID } from "@/domain/components";
import { ProductCategory, ProductTag } from "@/domain/dto/output";
import ProductCategories from "@/components/products/homePage/categories";
import Button from "@/components/shared/button";
import DashBoardLayout from "./layout";
import SearchFilters from "@/components/products/homePage/productFilters";
import PopularProductsSection from "@/components/products/homePage/popularProductsSection";
import ProductsNearYouSection from "@/components/products/homePage/productsNearYou";
import ProductsRecommendeForYouSection from "@/components/products/homePage/productsRecommendeForYou";
import UpcomingProductsSection from "@/components/products/homePage/upcomingProducts";
import MoreProductsSection from "@/components/products/homePage/more";

type HomePageProps = {
  getProductCategories: () => void;
  productCategories: Array<ProductCategory>;
  getCurrencies: () => void;
  productTags: Array<ProductTag>
  getProductTags: () => void;
};

const HomePage: FC<HomePageProps> & { layout: any } = ({
  getProductCategories,
  getCurrencies,
  getProductTags,
}) => {
  useEffect(() => {
    getProductCategories();
    getCurrencies();
    getProductTags();
  }, []);

  return (
    <div className="h-fit bg-white">
      {/* Search Filters */}
      <SearchFilters />

      {/* Activity Categories */}
      <ProductCategories />

      {/* Popular Products Section */}
      <PopularProductsSection />

      {/* Products near you Section */}
      <ProductsNearYouSection />

      {/* Upcoming products section */}
      <UpcomingProductsSection />

      {/* Products recommeded for you section */}
      <ProductsRecommendeForYouSection />

       {/* More Products section */}
       <MoreProductsSection />

      <div className="py-8 px-2 md:px-3 lg:px-4 bg-white text-center flex justify-center">
        <div className="flex justify-center px-4 sm:px-7">
          <Button
            width="w-full"
            bg="bg-primary"
            borderRadius="rounded"
            margin="mb-2"
            text="text-black"
            padding="py-2 px-4 md:px-8"
            isSecondary
          >
            Load more
          </Button>
        </div>
      </div>
    </div>
  );
};

HomePage.layout = DashBoardLayout;

const mapStateToProps = (state: RootState) => {
  const productsRequestProcessing = state.loading.models.products;
  const { isLoggedIn } = state.authentication;
  const { products } = state.products;
  const { productCategories, currencies, productTags } = state.settings;
  return {
    isLoggedIn,
    products,
    productCategories,
    productsRequestProcessing,
    currencies,
    productTags
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
