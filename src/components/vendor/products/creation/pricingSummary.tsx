import React, { FC, useState } from "react";
import { RootState } from "@/store";
import { connect } from "react-redux";
import NavigationButtons from "./navigationButtons";
import { NewProductPayload } from "@/domain/dto/input";
import { ProductPricing } from "@/domain/product";

type ProductPricingSummaryProps = {
  newProduct: NewProductPayload;
};

const ProductPricingSummary: FC<ProductPricingSummaryProps> = ({
  newProduct,
}) => {
  type TicketCategory = {
    key: string;
    title: string;
  };
  const ticketCategories: Array<TicketCategory> = [
    {
      key: "early_bird",
      title: "Early bird ticket",
    },
    {
      key: "standard",
      title: "Standard Ticket",
    },
    {
      key: "standard_at_the_gate",
      title: "Standard at the Gate",
    },
    {
      key: "last_minute",
      title: "Last Minute Ticket",
    },
    {
      key: "vip",
      title: "VIP ticket",
    },
    {
      key: "vvip",
      title: "VVIP Ticket",
    },
  ];

  return (
    <div>
      <p className="font-base mt-4 ml-0 md:ml-5 lg:ml-5 xl:ml-5 text-center mb-3">
        Charges summary
      </p>
      <div className="px-1 md:px-6 bg-white space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {newProduct?.pricing?.map(
            (pricing: ProductPricing, index: number) => {
              return (
                <div
                  key={index}
                  className="border border-primary rounded-xl p-4 space-y-2"
                >
                  <h3 className="text-lg font-semibold text-center">
                    {
                      ticketCategories?.find(
                        (cat: TicketCategory) => cat.key === pricing.ticket_tier
                      )?.title
                    }
                  </h3>
                  <p className="text-sm font-semibold text-center">
                    TOTAL CHARGEABLE (PER TICKET)
                  </p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Amount</span>
                      <span>{pricing?.cost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Discount</span>
                      <span>
                        {0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>
                        Service fee (0%)
                      </span>
                      <span>{0}</span>
                    </div>
                    <div className="flex justify-between font-bold text-green-600">
                      <span>Total</span>
                      <span>{pricing?.cost}</span>
                    </div>
                  </div>
                </div>
              );
            }
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
  const { newProduct } = state.vendor;
  return {
    newProduct,
  };
};

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductPricingSummary);
