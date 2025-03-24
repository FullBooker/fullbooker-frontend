"use client";

import React, { FC, useState } from "react";
import { connect } from "react-redux";
import { RootState } from "@/store";
import ProductsOutlet from "@/components/products/productsOutlet";
import { ProductsFilters } from "@/domain/dto/input";
import { HomePageProductSection } from "@/constants";

type CategoriesPageProps = {
  params: {
    category: string;
  };
};

const CategoriesPage: FC<CategoriesPageProps> = ({ params }) => {
  const [filters, setFilters] = useState<ProductsFilters>({
    page: 1,
    page_size: 25,
    category: params?.category?.split("_")[1] as string,
  });
  console.log(params)
  return (
    <ProductsOutlet
      filters={filters}
      setFilters={setFilters}
      isPopularNowProductsSection={
        params?.category === HomePageProductSection.popularNowProducts
      }
      isNearbyProductsSection={
        params?.category === HomePageProductSection.nearByProducts
      }
      isUpcomingProductsSection={
        params?.category === HomePageProductSection.upcomingProducts
      }
      isRecommendedForYouSection={
        params?.category === HomePageProductSection.recommendedProducts
      }
    />
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    state,
  };
};

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(CategoriesPage);
