"use client";

import React, { FC, useEffect } from "react";
import { RootState } from "@/store";
import { connect } from "react-redux";
import NavigationButtons from "./navigationButtons";
import { PricingType, ProductType } from "@/domain/constants";
import { Currency } from "@/domain/dto/output";
import { CircularProgress } from "@mui/material";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { addCommaSeparators } from "@/utilities";
import { NewProductPayload, ProductPricingPayload } from "@/domain/dto/input";

type OthersPricingProps = {
  getCurrencies: () => void;
  currencies: Array<Currency>;
  fetchingCurrencies: boolean;
  loading: boolean;
  addProductPricing: (payload: ProductPricingPayload) => void;
  newProduct: NewProductPayload;
};

const OthersPricing: FC<OthersPricingProps> = ({
  getCurrencies,
  currencies,
  fetchingCurrencies,
  loading,
  addProductPricing,
  newProduct,
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
    pricePerDayPass: yup.number().positive(),
    bulkDayPassDiscount: yup.number().min(0),
    maxDayPassTickets: yup.number().positive(),
    pricePerSubscription: yup.number().positive(),
    bulkSubscriptionDiscount: yup.number().min(0),
    maxSubscriptionTickets: yup.number().positive(),
  });

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const onSubmitCostPerSession = (data: any) => {
    addProductPricing({
      product: newProduct?.id,
      currency: data?.currency,
      cost:
        data?.pricePerSession -
        data?.bulkDiscount +
        (0.05 * data?.pricePerSession - data?.bulkDiscount),
      type: PricingType.session,
      maximum_number_of_tickets: data?.maximum_number_of_tickets,
    } as ProductPricingPayload);
  };

  return (
    <div>
      <p className="font-base mt-4 ml-0 md:ml-5 lg:ml-5 mb-3 xl:ml-5 text-center">
        How will you charge for your Activity?
      </p>
      <form onSubmit={handleSubmit(onSubmitCostPerSession)}>
        <div className="gap-4">
          <div className="px-1 md:px-6 bg-white space-y-6">
            <div className="flex items-center pb-4">
              <p className="text-lg font-semibold me-3">
                Select a currency for this event
              </p>
              {fetchingCurrencies ? (
                <div className="flex justify-center items-center mt-4 mb-4">
                  <CircularProgress
                    size={18}
                    color="inherit"
                    className="me-2"
                  />
                  <span>Fetching currencies...</span>
                </div>
              ) : (
                <div>
                  <Controller
                    name="currency"
                    control={control}
                    render={({ field }) => (
                      <select {...field} className="border p-1">
                        <option value="">Select currency</option>
                        {currencies.map((currency) => (
                          <option key={currency.id} value={currency.id}>
                            {currency.name}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  {errors.currency && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.currency.message}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Section A: Cost per session */}
            <div className="space-y-4 pb-6 col-span-1 grid md:grid-flow-col w-full gap-4">
              <div className="flex border-b border-primary pb-3 md:pb-12">
                <h3 className="flex items-center justify-center w-6 h-6 p-5 md:w-12 lg:w-12 xl:w-12 md:h-12 lg:h-12 xl:h-12 bg-black text-primary text-lg font-bold rounded-full shadow-lg me-4">
                  A
                </h3>
                <div className="space-y-2 w-full">
                  <p className="font-medium">Cost per session</p>
                  <label className="flex justify-between">
                    <p className="font-light me-1">
                      Please enter the price per person per session
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
                  <label className="flex justify-between">
                    <p className="font-light me-1">
                      Bulk booking discounts (Optional)
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

                  <label className="flex justify-between">
                    <p className="font-light me-1">
                      Maximum number of tickets per session
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
                        addCommaSeparators(
                          watch("pricePerSession") as number
                        )) ||
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
                      {0.05 *
                        ((watch("pricePerSession") ?? 0) -
                          (watch("bulkDiscount") ?? 0))}
                    </span>
                  </li>
                  <li className="font-bold text-green-600 flex justify-between">
                    <p>Total:</p>{" "}
                    <span>
                      {(watch("pricePerSession") ?? 0) -
                        (watch("bulkDiscount") ?? 0) +
                        0.05 *
                          ((watch("pricePerSession") ?? 0) -
                            (watch("bulkDiscount") ?? 0))}
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Section B: Day Pass */}
            <div className="space-y-4 pb-6 col-span-1 grid md:grid-flow-col gap-4 w-full">
              <div className="flex border-b border-primary pb-3 md:pb-12">
                <h3 className="flex items-center justify-center w-6 h-6 p-5 md:w-12 lg:w-12 xl:w-12 md:h-12 lg:h-12 xl:h-12 bg-black text-primary text-lg font-bold rounded-full shadow-lg me-4">
                  B
                </h3>
                <div className="space-y-2 w-full">
                  <p className="font-medium">Day Pass</p>
                  <label className="flex justify-between">
                    <p>Is there a day pass for this activity?</p>
                    <div className="flex space-x-4 mt-1">
                      <button className="px-4 py-1 border">Yes</button>
                      <button className="px-4 py-1 border">No</button>
                    </div>
                  </label>
                  <label className="flex justify-between">
                    <p className="font-light">
                      Please enter the price per person per day pass
                    </p>
                    <input
                      type="number"
                      className="block w-full border p-1 mt-2"
                    />
                  </label>
                  <label className="flex justify-between">
                    <p className="font-light">Any bulk booking discounts?</p>
                    <input
                      type="number"
                      className="block w-full border p-1 mt-2"
                    />
                  </label>
                  <label className="flex justify-between">
                    <p className="font-light">
                      Maximum number of tickets per day pass
                    </p>
                    <input
                      type="number"
                      className="block w-full border p-1 mt-2"
                    />
                  </label>
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
                </div>
              </div>
              <div className="border border-primary px-6 py-4 space-y-3">
                <h4 className="font-medium">TOTAL CHARGEABLE (DAY PASS)</h4>
                <ul className="space-y-3">
                  <li className="flex justify-between">
                    <p> Amount:</p> <span>5,000.00</span>
                  </li>
                  <li className="flex justify-between">
                    <p>Discount:</p> <span>0.00</span>
                  </li>
                  <li className="flex justify-between">
                    <p>Service fee (5%):</p> <span>250.00</span>
                  </li>
                  <li className="font-bold text-green-600 flex justify-between">
                    <p>Total: </p> <span>6,090.00</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Section C: Monthly subscription */}
            <div className="space-y-4 col-span-1 grid md:grid-flow-col mb-6 gap-4">
              <div className="flex">
                <h3 className="flex items-center justify-center w-6 h-6 p-5 md:w-12 lg:w-12 xl:w-12 md:h-12 lg:h-12 xl:h-12 bg-black text-primary text-lg font-bold rounded-full shadow-lg me-4">
                  C
                </h3>
                <div className="space-y-2 w-full">
                  <p className="font-medium">Monthly Subscription</p>
                  <label className="flex justify-between">
                    <p>Is there a monthly subscription for this activity?</p>
                    <div className="flex space-x-4 mt-1">
                      <button className="px-4 py-1 border">Yes</button>
                      <button className="px-4 py-1 border">No</button>
                    </div>
                  </label>
                  <label className="flex justify-between">
                    <p className="font-light">
                      Please enter the price per person per subscription
                    </p>
                    <input
                      type="number"
                      className="block w-full border p-1 mt-2"
                    />
                  </label>
                  <label className="flex justify-between">
                    <p className="font-light">Any bulk booking discounts?</p>
                    <input
                      type="number"
                      className="block w-full border p-1 mt-2"
                    />
                  </label>
                  <label className="flex justify-between">
                    <p className="font-light">
                      Maximum number of tickets per subscription
                    </p>
                    <input
                      type="number"
                      className="block w-full border p-1 mt-2"
                    />
                  </label>
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
                </div>
              </div>
              <div className="border border-primary px-6 py-4 space-y-3">
                <h4 className="font-medium">
                  TOTAL CHARGEABLE (MONTHLY SUBSCRIPTION)
                </h4>
                <ul className="space-y-3">
                  <li className="flex justify-between">
                    <p>Amount:</p> <span>5,000.00</span>
                  </li>
                  <li className="flex justify-between">
                    <p>Discount:</p> <span>0.00</span>
                  </li>
                  <li className="flex justify-between">
                    <p>Service fee (5%):</p> <span>250.00</span>
                  </li>
                  <li className="font-bold text-green-600 flex justify-between">
                    <p>Total:</p> <span>6,090.00</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="px-2 md:px-10 mt-4 md:mt-10">
          <NavigationButtons />
        </div>
      </form>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const fetchingCurrencies = state.loading.models.settings;
  const loading = state.loading.models.vendor;
  const { currencies } = state.settings;
  const { newProduct } = state.vendor;
  return {
    currencies,
    fetchingCurrencies,
    loading,
    newProduct,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  getCurrencies: () => dispatch.settings.getCurrencies(),
  addProductPricing: (payload: ProductPricingPayload) =>
    dispatch.vendor.addProductPricing(payload),
});

export default connect(mapStateToProps, mapDispatchToProps)(OthersPricing);
