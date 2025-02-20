"use client";

import React, { FC, useEffect, useState } from "react";
import Image from "next/image";
import { connect } from "react-redux";
import { RootState } from "@/store";
import "react-loading-skeleton/dist/skeleton.css";
import { CartItem, CartSummary } from "@/domain/product";
import { AuthData, Currency } from "@/domain/dto/output";
import DashBoardLayout from "../../../../layout";
import Button from "@/components/shared/button";
import useIsMobile from "@/lib/hooks/useIsMobile";
import {
  addCommaSeparators,
  generateUUID,
  hideMiddleCharacters,
} from "@/utilities";
import LocationIdentifier from "@/components/shared/locationidentifier";
import { useRouter } from "next/navigation";
import { ModalID } from "@/domain/components";
import QRCode from "react-qr-code";

type CheckoutPageProps = {
  productsRequestProcessing: boolean;
  cart: Array<CartItem>;
  currencies: Array<Currency>;
  cartSummary: CartSummary;
  getCurrencies: () => void;
  setActiveModal: (modalId: ModalID) => void;
  authData: AuthData;
};

const CheckoutPage: FC<CheckoutPageProps> & { layout: any } = ({
  productsRequestProcessing,
  cart,
  cartSummary,
  currencies,
  getCurrencies,
  setActiveModal,
  authData,
}) => {
  const isMobile = useIsMobile();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [baseCurrency, setBaseCurrency] = useState("");
  const router = useRouter();

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
    <div className="gap-6 max-w-7xl mx-auto py-6 md:py-10 px-4 md:px-7 ">
      <div className="mb-4">
        <p className="text-center text-lg font-semibold">
          Hello {authData?.user?.first_name}, Download your ticket below or
          check your email at{" "}
          {hideMiddleCharacters(authData?.user?.email) || ""}
        </p>
      </div>
      <div className="overflow-x-auto whitespace-nowrap">
        <div className="flex items-center justify-center bg-gray-100 min-w-[800px] md:min-w-[1200px]">
          <div className="flex w-[1200px] h-[250px] md:h-[400px] borderrounded-md shadow-lg">
          <p className="[writing-mode:sideways-lr] text-center text-white bg-primary py-4">FULLBOOKER</p>

            {/* Left Section */}
            <div className="w-[full] md:w-1/3 bg-white border-r-8 border-dashed p-4 flex flex-col justify-between px-4">
              <div className="w-full">
                <h2 className="text-sm font-bold">Rock Concert</h2>
                <p className="text-xs mt-2">
                  <span className="font-semibold">Name:</span> Kelvin Kinoti
                  Laichena
                </p>
                <p className="text-xs">
                  <span className="font-semibold">ID:</span> 35617888
                </p>
              </div>
              <div className="flex w-full">
                {/* QR Code Placeholder */}
                <QRCode size={isMobile ? 100 : 250} value={generateUUID()} />
              </div>
              {/* <p className="text-xs text-gray-600 text-center rotate-180 transform origin-left">
              Fullbooker
            </p> */}
            </div>

            {/* Right Section */}
            <div className="w-full md:w-2/3 p-4 bg-white relative">
              <h2 className="text-2xl font-bold text-center">Rock Concert</h2>

              <div className="mt-3 text-sm w-full">
                <p>
                  <span className="font-semibold">Confirmation Number:</span>{" "}
                  FGEDE46374H2
                </p>
                <p>
                  <span className="font-semibold">Name:</span> Kelvin Kinoti
                  Laichena
                </p>
                <p>
                  <span className="font-semibold">ID:</span> 35617888
                </p>
              </div>

              <p className="text-sm font-semibold mt-4">
                Location:{" "}
                <span className="font-normal">
                  Carnivore Grounds, Nairobi, Kenya
                </span>
              </p>

              {/* Right Floating Section */}
              <div className="absolute top-4 right-4 text-right text-sm">
                <p className="font-semibold">19TH February</p>
                <p>5PM - 1AM</p>
              </div>

              {/* Emergency Contact */}
              <div className="absolute bottom-4 right-4 text-right text-sm">
                <p className="font-semibold">Emergency Contact</p>
                <p>+254721611555</p>
                <p>St Johns Ambulance</p>
              </div>

              {/* Vertical Text */}
              {/* <p className="absolute right-0 top-1/2 transform -translate-y-1/2 rotate-180 text-gray-600 text-xs">
              REGULAR
            </p> */}
            </div>

            <p className="[writing-mode:vertical-rl] text-center text-white bg-primary py-4">REGULAR</p>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <Button
          padding="px-4 py-2"
          margin="mt-4"
          borderRadius="rounded-sm"
          text="text-black"
          bg="bg-primary"
        >
          Download ticket
        </Button>
      </div>
    </div>
  );
};

CheckoutPage.layout = DashBoardLayout;

const mapStateToProps = (state: RootState) => {
  const loading = state.loading.models.products;
  const { authData } = state.authentication;
  const { cart, cartSummary } = state.products;
  const { currencies } = state.settings;
  return {
    loading,
    cart,
    currencies,
    cartSummary,
    authData,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  getCurrencies: () => dispatch.settings.getCurrencies(),
  setActiveModal: (modalId: ModalID) =>
    dispatch.components.setActiveModal(modalId),
});

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutPage);
