"use client";

import React, { FC, useEffect, useState } from "react";
import Image from "next/image";
import { connect } from "react-redux";
import { RootState } from "@/store";
import "react-loading-skeleton/dist/skeleton.css";
import { CartItem, CartSummary } from "@/domain/product";
import { Currency } from "@/domain/dto/output";
import DashBoardLayout from "../../layout";
import Button from "@/components/shared/button";
import useIsMobile from "@/lib/hooks/useIsMobile";
import { addCommaSeparators } from "@/utilities";
import LocationIdentifier from "@/components/shared/locationidentifier";
import { ModalID } from "@/domain/components";

type CheckoutPageProps = {
  productsRequestProcessing: boolean;
  cart: Array<CartItem>;
  currencies: Array<Currency>;
  cartSummary: CartSummary;
  getCurrencies: () => void;
  setActiveModal: (modalId: ModalID) => void;
};

const CheckoutPage: FC<CheckoutPageProps> & { layout: any } = ({
  productsRequestProcessing,
  cart,
  cartSummary,
  currencies,
  getCurrencies,
  setActiveModal,
}) => {
  const isMobile = useIsMobile();

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [baseCurrency, setBaseCurrency] = useState("");

  useEffect(() => {
    getCurrencies();

    if (currencies?.length > 0) {
      setBaseCurrency(
        currencies?.find(
          (currency: Currency) => currency?.id === cartSummary?.base_currency
        )?.code as string
      );
    }
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto py-6 md:py-10 px-4 md:px-7">
      {/* Order Summary */}
      <div className="w-full lg:w-1/2 border border-gray-400 py-4 md:py-6 px-6 shadow-sm">
        <h2 className="text-xl font-semibold text-center mb-4 border-b border-gray-300 pb-2 md:pb-4">
          Order Summary
        </h2>
        <div className="overflow-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left font-medium pb-2">Name</th>
                <th className="text-left font-medium pb-2">Unit Price</th>
                <th className="text-left font-medium pb-2">QTY</th>
                <th className="text-left font-medium pb-2">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b pb-4 mb-4">
                <td className="py-3 flex items-center gap-2">
                  <Image
                    src={cartSummary?.product_thumbnail}
                    alt={`${cartSummary?.product_title} Image`}
                    width={isMobile ? 45 : 45}
                    height={isMobile ? 45 : 50}
                    className="rounded h-[50px] md:h-[45px]"
                    unoptimized={true}
                  />
                  <div>
                    <h3 className="font-medium">
                      {cartSummary?.product_title}
                    </h3>
                    <p className="text-gray-500 text-sm w-44">
                      <LocationIdentifier
                        coordinates={cartSummary?.product_location}
                      />
                    </p>
                  </div>
                </td>
                <td className="py-3 text-green-600 font-medium">
                  {baseCurrency}{" "}
                  {addCommaSeparators(
                    parseInt(cartSummary?.product_base_price)
                  )}
                </td>
                <td className="py-3">{cartSummary?.total_items}</td>
                <td className="py-3 text-green-600 font-medium">
                  {baseCurrency} {addCommaSeparators(cartSummary?.total_price)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Discount Code */}
        <div className="flex items-center py-6 mb-4 w-full border-b border-t">
          <div className="w-full me-2">
            <input
              type="text"
              placeholder="Gift or discount code (Optional)"
              className="flex-1 p-2 outline-none border border-gray-300 rounded w-full"
            />
          </div>
          <div>
            <Button
              borderRadius="rounded"
              text="font-medium text-white"
              padding="py-2 px-8"
            >
              Apply
            </Button>
          </div>
        </div>

        {/* Pricing */}
        <div className="text-s">
          <div className="flex justify-between w-full">
            <span>Subtotal</span>
            <span>
              {baseCurrency} {addCommaSeparators(cartSummary?.total_price)}
            </span>
          </div>
        </div>

        <div className="border-t mt-4 pt-4 flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span className="text-green-600">
            {baseCurrency} {addCommaSeparators(cartSummary?.total_price)}
          </span>
        </div>
      </div>

      {/* Payment Section */}
      <div className="w-full lg:w-1/2 border border-gray-400 py-4 md:py-6 px-6 shadow-sm">
        <h2 className="text-xl font-semibold text-center mb-4 border-b border-gray-300 pb-2 md:pb-4">
          Payment
        </h2>

        {/* Payment Options */}
        <div className="flex gap-4 mb-4">
          {["card", "bank", "mpesa"].map((method) => (
            <label
              key={method}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="radio"
                name="payment"
                value={method}
                checked={paymentMethod === method}
                onChange={() => setPaymentMethod(method)}
                className="accent-green-600"
              />
              {method.charAt(0).toUpperCase() + method.slice(1)}
            </label>
          ))}
        </div>

        {/* Card Details */}
        {paymentMethod === "card" && (
          <>
            <div className="mb-4 space-y-2">
              <label className="block text-sm">Card Number</label>
              <input
                type="text"
                placeholder="1234 5678 9101 1121"
                className="outline-none border border-gray-300 rounded w-full p-2 "
              />
            </div>

            <div className="flex gap-4 mb-4">
              <div className="flex-1 space-y-2">
                <label className="block text-sm">Expiration Date</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="outline-none border border-gray-300 rounded w-full p-2 "
                />
              </div>
              <div className="w-1/3 space-y-2">
                <label className="block text-sm">CVV</label>
                <input
                  type="text"
                  placeholder="123"
                  className="outline-none border border-gray-300 rounded w-full p-2 "
                />
              </div>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                id="saveCard"
                className="accent-green-600"
              />
              <label htmlFor="saveCard" className="text-sm">
                Save card details
              </label>
            </div>
          </>
        )}

        {/* Pay Button */}
        <Button
          padding="py-3"
          margin="mt-4"
          borderRadius="rounded-lg"
          text="w-full font-medium text-white"
          bg="bg-success"
          onClick={() => setActiveModal(ModalID.successfullPayment)}
        >
          Pay {baseCurrency} {addCommaSeparators(cartSummary?.total_price)}
        </Button>

        <p className="text-xs text-gray-500 mt-4 text-center">
          Your personal data will be used to process your order and support your
          experience as described in our privacy policy.
        </p>
      </div>
    </div>
  );
};

CheckoutPage.layout = DashBoardLayout;

const mapStateToProps = (state: RootState) => {
  const loading = state.loading.models.products;
  const { cart, cartSummary } = state.products;
  const { currencies } = state.settings;
  return {
    loading,
    cart,
    currencies,
    cartSummary,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  getCurrencies: () => dispatch.settings.getCurrencies(),
  setActiveModal: (modalId: ModalID) =>
    dispatch.components.setActiveModal(modalId),
});

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutPage);
