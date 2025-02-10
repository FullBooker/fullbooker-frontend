"use client";

import React, { FC, useEffect, useState } from "react";
import { RootState } from "@/store";
import { connect } from "react-redux";
import NavigationButtons from "./navigationButtons";
import { ProductType } from "@/domain/constants";
import { Currency } from "@/domain/dto/output";
import { CircularProgress } from "@mui/material";

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

  return (
    <div>
        <p className="font-base mt-4 mb-3 mr-1 md:mr-6 text-right">
          Cost per ticket category
        </p>
      <div className="gap-4">
        <div className="px-1 md:px-6 bg-white space-y-6">
          <div className="flex items-center pb-4 border border-primary px-4 p-2">
            <p className="text-lg font-semibold me-3">
              Select a currency for this event
            </p>
            {fetchingCurrencies ? (
              <div className="flex justify-center items-center mt-4 mb-4">
                <CircularProgress size={18} color="inherit" className="me-2" />
                <span>Fetching currencies...</span>
              </div>
            ) : (
              <select className="border p-1">
                <option value="">Select currency</option>
                {currencies?.map((currency: Currency, index: number) => (
                  <option key={index} value={currency?.id}>
                    {currency?.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Select Ticket Categories */}
          <div className="grid grid-cols-2 gap-6 pb-6 ">
            <div className="border border-primary px-4 p-2">
              <h3 className="font-bold">Select ticket categories</h3>
              <div className="space-y-2 mt-2">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span>Select all</span>
                </label>
                {[
                  "Early Bird Ticket",
                  "Standard Ticket",
                  "Standard At the gate",
                  "Last-Minute Ticket",
                  "VIP Ticket",
                  "VVIP Ticket",
                ].map((category) => (
                  <label key={category} className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="font-light">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="border border-primary px-4 p-2">
              <h3 className="font-bold">
                Provide the price per ticket per category
              </h3>
              <div className="space-y-2 mt-2">
                {[
                  "Early Bird Ticket",
                  "Standard Ticket",
                  "Standard At the gate",
                  "Last-Minute Ticket",
                  "VIP Ticket",
                  "VVIP Ticket",
                ].map((category) => (
                  <div key={category} className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 w-full">
                      <input type="checkbox" className="rounded" />
                      <span className="w-1/2 font-light">{category}</span>
                    </label>
                    <select className="border p-1 w-1/2">
                      <option value="KES">KES</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Maximum Tickets and Discounts */}
          <div className="grid grid-cols-2 gap-6">
            <div className="border border-primary px-4 p-2">
              <h3 className="font-bold">
                Provide the maximum number of tickets per category
              </h3>
              <div className="space-y-2 mt-2">
                {[
                  "Early Bird Ticket",
                  "Standard Ticket",
                  "Standard At the gate",
                  "Last-Minute Ticket",
                  "VIP Ticket",
                  "VVIP Ticket",
                ].map((category) => (
                  <div key={category} className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 w-full">
                      <input type="checkbox" className="rounded" />
                      <span className="w-1/2 font-light">{category}</span>
                    </label>
                    <input
                      type="number"
                      placeholder="Max tickets"
                      className="border p-1 w-1/2"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-primary px-4 p-2">
              <h3 className="font-bold">
                Enter the discount per category (optional)
              </h3>
              <div className="space-y-2 mt-2">
                {[
                  "Early Bird Ticket",
                  "Standard Ticket",
                  "Standard At the gate",
                  "Last-Minute Ticket",
                  "VIP Ticket",
                  "VVIP Ticket",
                ].map((category) => (
                  <div key={category} className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 w-full">
                      <input type="checkbox" className="rounded" />
                      <span className="w-1/2 font-light">{category}</span>
                    </label>
                    <select className="border p-1 w-1/2">
                      <option value="KES">KES</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>
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
