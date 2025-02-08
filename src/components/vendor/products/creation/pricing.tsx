"use client";

import React, { FC } from "react";
import { RootState } from "@/store";
import { connect } from "react-redux";
import { ProductType } from "@/domain/constants";
import EventsPricing from "./eventsPricing";
import OtherProductsPricing from "./otherProductsPricing";

type ProductPricingProps = {
  productType: ProductType;
};

const ProductPricing: FC<ProductPricingProps> = ({ productType }) => {
  return (
    <div>
      {productType === ProductType.event ? (
        <EventsPricing />
      ) : (
        <OtherProductsPricing />
      )}
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const { productType } = state.vendor;
  return {
    productType,
  };
};

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ProductPricing);
