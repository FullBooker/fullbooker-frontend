"use client";

import React, { FC } from "react";
import { connect } from "react-redux";
import { RootState } from "@/store";
import ProductsOutlet from "@/components/products/productsOutlet";

type SubCategoriesPageProps = {};

const SubCategoriesPage: FC<SubCategoriesPageProps> = ({}) => {
  return <ProductsOutlet />;
};

const mapStateToProps = (state: RootState) => {
  return {
    state,
  };
};

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(SubCategoriesPage);
