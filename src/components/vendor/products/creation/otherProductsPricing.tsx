"use client";

import React, { FC, useEffect, useState } from "react";
import { RootState } from "@/store";
import { connect } from "react-redux";
import NavigationButtons from "./navigationButtons";
import { PricingType, ProductType } from "@/domain/constants";
import { Currency } from "@/domain/dto/output";
import { CircularProgress } from "@mui/material";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import PricePerSession from "./pricing/costPerSession";
import DayPassPricing from "./pricing/dayPass";
import MonthlySubscriptionPricing from "./pricing/monthlySubscription";
import { NewProductPayload, ProductPricingPayload } from "@/domain/dto/input";

type OthersPricingProps = {
  getCurrencies: () => void;
  currencies: Array<Currency>;
  fetchingCurrencies: boolean;
};

const OthersPricing: FC<OthersPricingProps> = ({
  getCurrencies,
  currencies,
  fetchingCurrencies,
}) => {
  useEffect(() => {
    getCurrencies();
  }, []);

  const [currency, setSelectedCurrency] = useState<string>("");

  return (
    <div>
      <p className="font-base mt-4 ml-0 md:ml-5 lg:ml-5 mb-3 xl:ml-5 text-center">
        How will you charge for your Activity?
      </p>
      <div className="gap-4">
        <div className="px-1 md:px-6 bg-white space-y-6">
          <div className="flex items-center pb-4">
            <p className="text-lg font-semibold me-3">
              Select a currency for this event
            </p>
            {fetchingCurrencies ? (
              <div className="flex justify-center items-center mt-4 mb-4">
                <CircularProgress size={18} color="inherit" className="me-2" />
                <span>Fetching currencies...</span>
              </div>
            ) : (
              <div>
                <select
                  className="border p-1"
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                >
                  <option value="">Select currency</option>
                  {currencies.map((currency) => (
                    <option key={currency.id} value={currency.id}>
                      {currency.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Section A: Cost per session */}
          <PricePerSession currency={currency} />

          {/* Section B: Day Pass */}
          <DayPassPricing currency={currency} />

          {/* Section C: Monthly subscription */}
          <MonthlySubscriptionPricing currency={currency} />
        </div>
      </div>
      <div className="px-2 md:px-10 mt-4 md:mt-10">
        <NavigationButtons />
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const fetchingCurrencies = state.loading.models.settings;
  const { currencies } = state.settings;
  const { newProduct } = state.vendor;
  return {
    currencies,
    fetchingCurrencies,
    newProduct,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  getCurrencies: () => dispatch.settings.getCurrencies(),
});

export default connect(mapStateToProps, mapDispatchToProps)(OthersPricing);
