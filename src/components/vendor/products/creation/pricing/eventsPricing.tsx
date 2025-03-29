"use client";

import React, { FC, useEffect, useState } from "react";
import { RootState } from "@/store";
import { connect } from "react-redux";
import NavigationButtons from "../navigationButtons";
import { Currency } from "@/domain/dto/output";
import { CircularProgress } from "@mui/material";
import { TICKET_PRICING_CATEGORIES } from "@/constants";
import { TicketPricingCategory } from "@/domain/product";
import EventPricing from "./event.pricing";
import StepHeader from "../stepHeader";

type EventsPricingProps = {
  getCurrencies: () => void;
  currencies: Array<Currency>;
  fetchingCurrencies: boolean;
};

const EventsPricing: FC<EventsPricingProps> = ({
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
        <div className="px-1 md:px-6 bg-white space-y-6">
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
              <select
                className="border p-1"
                onChange={(e) => setSelectedCurrency(e.target.value)}
              >
                <option value="">Select currency</option>
                {currencies.map((currency) => (
                  <option key={currency.id} value={currency.id}>
                    {currency.code}
                  </option>
                ))}
              </select>
            )}
          </div>
          {TICKET_PRICING_CATEGORIES.map(
            (ticketPricingCatgeory: TicketPricingCategory, index: number) => (
              <div key={index}>
                <EventPricing
                  currency={currency}
                  pricingType={ticketPricingCatgeory}
                />
              </div>
            )
          )}
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
  return {
    currencies,
    fetchingCurrencies,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  getCurrencies: () => dispatch.settings.getCurrencies(),
});

export default connect(mapStateToProps, mapDispatchToProps)(EventsPricing);
