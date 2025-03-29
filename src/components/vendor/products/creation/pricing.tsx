"use client";

import React, { FC, useEffect } from "react";
import { RootState } from "@/store";
import { connect } from "react-redux";
import { ProductType } from "@/domain/constants";
import EventsPricing from "./pricing/eventsPricing";
import OtherProductsPricing from "./pricing/otherProductsPricing";

type ProductPricingProps = {
  productType: ProductType;
  getCurrencies: () => void;
};

const ProductPricing: FC<ProductPricingProps> = ({
  productType,
  getCurrencies,
}) => {
  useEffect(() => {
    getCurrencies();
  }, []);
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

const mapDispatchToProps = (dispatch: any) => ({
  getCurrencies: () => dispatch.settings.getCurrencies(),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductPricing);
