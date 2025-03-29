"use client";

import React, { FC, useState } from "react";
import { connect } from "react-redux";
import { RootState } from "@/store";
import ProductsOutlet from "@/components/products/productsOutlet";
import { ProductsFilters } from "@/domain/dto/input";

type UniversalProductsPageProps = {
};

const UniversalProductsPage: FC<UniversalProductsPageProps> = ({  }) => {
  const [filters, setFilters] = useState<ProductsFilters>({
    page: 1,
    page_size: 25,
  });
  return <ProductsOutlet filters={filters} setFilters={setFilters} />;
};

const mapStateToProps = (state: RootState) => {
  return {
    state,
  };
};

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(UniversalProductsPage);
