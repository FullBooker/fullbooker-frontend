"use client";

import React, { FC, useEffect, useState } from "react";
import { RootState } from "@/store";
import { connect } from "react-redux";
import NavigationButtons from "../navigationButtons";
import { Currency } from "@/domain/dto/output";
import { CircularProgress } from "@mui/material";
import StepHeader from "../stepHeader";
import { SESSION_PRICING_CATEGORIES } from "@/constants";
import { SessionPricingCategory } from "@/domain/product";
import ActivityPricing from "./activity.pricing";

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
      <StepHeader title="How will you charge for your Activity?" />
      <div className="gap-4">
        <div className="px-1 md:px-6  space-y-6">
          <div className="flex items-center pb-4">
            <p className="text-lg font-medium me-3">
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
                  {currencies?.map((currency) => (
                    <option key={currency.id} value={currency.id}>
                      {currency.code}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {SESSION_PRICING_CATEGORIES.map(
            (pricingCatgeory: SessionPricingCategory, index: number) => (
              <div key={index}>
                <ActivityPricing
                  currency={currency}
                  pricingType={pricingCatgeory}
                />
              </div>
            )
          )}
        </div>
      </div>
        <NavigationButtons isFormSubmit/>
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
