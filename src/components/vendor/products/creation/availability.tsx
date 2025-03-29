import React, { FC } from "react";
import { ProductType } from "@/domain/constants";
import { RootState } from "@/store";
import { connect } from "react-redux";

import EventAvailability from "./availability/event.availability";
import OtherProductsAvailability from "./availability/activity.availability";

type ProductLocationProps = {
  productType: ProductType;
};

const ProductLocation: FC<ProductLocationProps> = ({ productType }) => {
  return (
    <div>
      {[ProductType.oneTime, ProductType.multiDay].includes(productType) ? (
        <EventAvailability />
      ) : (
        <OtherProductsAvailability />
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

export default connect(mapStateToProps, mapDispatchToProps)(ProductLocation);
