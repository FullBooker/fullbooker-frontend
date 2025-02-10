"use client";

import React, { FC, useEffect } from "react";
import { RootState } from "@/store";
import { connect } from "react-redux";
import { PricingType, ProductType } from "@/domain/constants";
import { Currency } from "@/domain/dto/output";
import { CircularProgress } from "@mui/material";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { addCommaSeparators } from "@/utilities";
import { NewProductPayload, ProductPricingPayload } from "@/domain/dto/input";

type MonthlySubscriptionPricingProps = {
  getCurrencies: () => void;
  currencies: Array<Currency>;
  fetchingCurrencies: boolean;
  loading: boolean;
  addProductPricing: (payload: ProductPricingPayload) => void;
  newProduct: NewProductPayload;
  currency: string;
};

const MonthlySubscriptionPricing: FC<MonthlySubscriptionPricingProps> = ({
  getCurrencies,
  currencies,
  fetchingCurrencies,
  loading,
  addProductPricing,
  newProduct,
  currency,
}) => {
  useEffect(() => {
    getCurrencies();
  }, []);

  interface PricingFormData {
    currency: string;
    pricePerSession: number;
    bulkDiscount: number;
    maximum_number_of_tickets: number;
    pricePerDayPass: number;
    bulkDayPassDiscount: number;
    maxDayPassTickets: number;
    pricePerSubscription: number;
    bulkSubscriptionDiscount: number;
    maxSubscriptionTickets: number;
  }

  const schema = yup.object().shape({
    currency: yup.string().required("Currency selection is required"),
    pricePerSession: yup
      .number()
      .positive()
      .required("Price per session is required"),
    bulkDiscount: yup.number().min(0),
    maximum_number_of_tickets: yup
      .number()
      .positive()
      .required("Maximum tickets per session is required"),
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      currency: currency,
      bulkDiscount: 0
    },
    mode: "onBlur",
  });

  const onSubmitCostPerSession = (data: any) => {
    addProductPricing({
      product: newProduct?.id,
      currency: currency,
      cost:
        data?.pricePerSession -
        data?.bulkDiscount +
        (0.05 * data?.pricePerSession - data?.bulkDiscount),
      type: PricingType.monthly_subscription,
      maximum_number_of_tickets: data?.maximum_number_of_tickets,
    } as ProductPricingPayload);
  };

  useEffect(() => {
    setValue("currency", currency);
  }, [currency]);

  return (
    <div className="space-y-4 pb-6 col-span-1 grid md:grid-flow-col w-full gap-4">
      <div className="flex border-b border-primary pb-3 md:pb-12">
        <h3 className="flex items-center justify-center w-6 h-6 p-5 md:w-12 lg:w-12 xl:w-12 md:h-12 lg:h-12 xl:h-12 bg-black text-primary text-lg font-bold rounded-full shadow-lg me-4">
          C
        </h3>
        <div className="space-y-2 w-full">
          <form onSubmit={handleSubmit(onSubmitCostPerSession)}>
            <p className="font-medium">Monthly Subscription</p>
            <label className="flex justify-between">
              <p className="font-light me-1">
                Please enter the price per person per subscription
              </p>
              <div className="w-full">
                <Controller
                  name="pricePerSession"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      className="block w-full border p-1 mt-2"
                    />
                  )}
                />
                {errors.pricePerSession && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.pricePerSession.message}
                  </p>
                )}
              </div>
            </label>
            <label className="flex justify-between mt-2">
              <p className="font-light me-1">
                Any bulk booking discounts?(Optional)
              </p>
              <div className="w-full">
                <Controller
                  name="bulkDiscount"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      className="block w-full border p-1 mt-2"
                    />
                  )}
                />
                {errors.bulkDiscount && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.bulkDiscount.message}
                  </p>
                )}
              </div>
            </label>
            <label className="flex justify-between mt-2">
              <p className="font-light me-1">
                Maximum number of tickets per subscription
              </p>
              <div className="w-full">
                <Controller
                  name="maximum_number_of_tickets"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      className="block w-full border p-1 mt-2"
                    />
                  )}
                />
                {errors.maximum_number_of_tickets && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.maximum_number_of_tickets.message}
                  </p>
                )}
              </div>
            </label>
            <div>
              {errors.currency && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.currency.message}
                </p>
              )}
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="w-[50%] bg-primary text-black py-2 rounded-md mb-2 mt-4"
              >
                {loading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </form>
        </div>

        <div></div>
      </div>
      <div className="border border-primary px-6 py-4 space-y-3">
        <h4 className="font-medium">TOTAL CHARGEABLE (PER SESSION)</h4>
        <ul className="space-y-1">
          <li className="flex justify-between">
            <p>Amount:</p>{" "}
            <span>
              {(watch("pricePerSession") &&
                addCommaSeparators(watch("pricePerSession") as number)) ||
                0.0}
            </span>
          </li>
          <li className="flex justify-between">
            <p> Discount:</p>
            <span>
              {(watch("bulkDiscount") &&
                addCommaSeparators(watch("bulkDiscount") as number)) ||
                0.0}
            </span>
          </li>
          <li className="flex justify-between">
            <p>Service fee (5%):</p>
            <span>
              {Math.round(0.05 *
                ((watch("pricePerSession") ?? 0) -
                  (watch("bulkDiscount") ?? 0)))}
            </span>
          </li>
          <li className="font-bold text-green-600 flex justify-between">
            <p>Total:</p>{" "}
            <span>
              {Math.round((watch("pricePerSession") ?? 0) -
                (watch("bulkDiscount") ?? 0) +
                0.05 *
                  ((watch("pricePerSession") ?? 0) -
                    (watch("bulkDiscount") ?? 0)))}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const loading = state.loading.models.vendor;
  const { currencies } = state.settings;
  const { newProduct } = state.vendor;
  return {
    currencies,
    loading,
    newProduct,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  getCurrencies: () => dispatch.settings.getCurrencies(),
  addProductPricing: (payload: ProductPricingPayload) =>
    dispatch.vendor.addProductPricing(payload),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MonthlySubscriptionPricing);
