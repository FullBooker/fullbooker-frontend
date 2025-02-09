"use client";

import React, { FC, useEffect, useState } from "react";
import { Calendar, MapPin, ChevronDown, CalendarDays } from "lucide-react";
import NavigationButtons from "./navigationButtons";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { ProductType } from "@/domain/constants";
import { RootState } from "@/store";
import { connect } from "react-redux";
import {
  NewProductPayload,
  OpenDay,
  ProductAvailabilityPayload,
} from "@/domain/dto/input";
import { DayOfWeek } from "@/domain/dto/output";
import { CircularProgress } from "@mui/material";
import LocationSearch from "./locationSearch";
import EventAvailability from "./eventAvailability";
import OtherProductsAvailability from "./otherProductsAvailability";

type ProductLocationProps = {
  productType: ProductType;
};

const ProductLocation: FC<ProductLocationProps> = ({ productType }) => {
  return (
    <div>
      {productType === ProductType.event ? (
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
