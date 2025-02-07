import React, { FC, useState } from "react";
import { RootState } from "@/store";
import { connect } from "react-redux";
import NavigationButtons from "./navigationButtons";

type ProductPricingSummaryProps = {};

const ProductPricingSummary: FC<ProductPricingSummaryProps> = ({}) => {
  const ticketCategories = [
    "Early bird ticket",
    "Standard Ticket",
    "Standard at the Gate",
    "Last Minute Ticket",
    "VIP ticket",
    "VVIP Ticket",
  ];

  const priceDetails = {
    amount: 6000,
    discount: 0,
    serviceFeePercent: 5,
  };

  const calculateServiceFee = (amount: any, serviceFeePercent: any) =>
    (amount * serviceFeePercent) / 100;

  return (
    <div>
      <p className="font-base mt-4 ml-0 md:ml-5 lg:ml-5 xl:ml-5 text-center mb-3">
        Charges summary
      </p>
      <div className="px-1 md:px-6 bg-white space-y-6">
        <div className="grid grid-cols-3 gap-6">
          {ticketCategories.map((category) => {
            const serviceFee = calculateServiceFee(
              priceDetails.amount,
              priceDetails.serviceFeePercent
            );
            const total = priceDetails.amount + serviceFee;

            return (
              <div
                key={category}
                className="border border-primary rounded-xl p-4 space-y-2"
              >
                <h3 className="text-lg font-bold text-center">{category}</h3>
                <p className="text-sm font-semibold text-center">
                  TOTAL CHARGEABLE (PER TICKET)
                </p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Amount</span>
                    <span>{priceDetails.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount</span>
                    <span>
                      ({priceDetails.discount}%)
                      {(priceDetails.amount * priceDetails.discount).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service fee ({priceDetails.serviceFeePercent}%)</span>
                    <span>{serviceFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-green-600">
                    <span>Total</span>
                    <span>{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="px-2 md:px-10 mt-4 md:mt-10">
        <NavigationButtons />
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  return {};
};

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductPricingSummary);
