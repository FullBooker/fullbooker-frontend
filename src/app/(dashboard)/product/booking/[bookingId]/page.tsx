"use client";

import React, { FC, useEffect, useState } from "react";
import Image from "next/image";
import { connect } from "react-redux";
import { Dispatch, RootState } from "@/store";
import "react-loading-skeleton/dist/skeleton.css";
import {
  CartItem,
  CartSummary,
  ProductPricing,
  SessionPricingCategory,
  TicketPricingCategory,
} from "@/domain/product";
import { Currency } from "@/domain/dto/output";
import DashBoardLayout from "../../../layout";
import Button from "@/components/shared/button";
import useIsMobile from "@/lib/hooks/useIsMobile";
import { addCommaSeparators } from "@/utilities";
import { ModalID } from "@/domain/components";
import { Ticket, TicketBookingOrder } from "@/domain/ticket";
import MobileMiniAppBar from "@/components/layout/mobileMiniAppBar";
import { withAuth } from "../../../../../components/views/dash/authGuard";
import {
  SESSION_PRICING_CATEGORIES,
  TICKET_PRICING_CATEGORIES,
} from "@/constants";

type CheckoutPageProps = {
  productsRequestProcessing: boolean;
  cart: Array<CartItem>;
  currencies: Array<Currency>;
  cartSummary: CartSummary;
  getCurrencies: () => void;
  setActiveModal: (modalId: ModalID) => void;
  params: {
    bookingId: string;
  };
  getTicketBookingOrderById: (bookingId: string) => void;
  ticketBookingOrder: TicketBookingOrder;
  fetchingBookingRequestProcessing: boolean;
};

type GroupedTicket = {
  title: string;
  currency: string;
  count: number;
  cost: string;
  date: string;
};

const CheckoutPage: FC<CheckoutPageProps> & { layout: any } = ({
  currencies,
  getCurrencies,
  setActiveModal,
  params,
  getTicketBookingOrderById,
  ticketBookingOrder,
  fetchingBookingRequestProcessing,
}) => {
  const isMobile = useIsMobile();

  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [baseCurrency, setBaseCurrency] = useState("");

  const groupTickets = (tickets: Array<Ticket>): Array<GroupedTicket> => {
    const grouped = tickets?.reduce(
      (acc: Record<string, GroupedTicket>, ticket) => {
        const { type, ticket_tier, cost, currency } = ticket.pricing_details;
        const key =
          type === "ticket" ? (ticket_tier as string) : (type as string);
        const title =
          type === "ticket"
            ? TICKET_PRICING_CATEGORIES.find(
                (tCat: TicketPricingCategory) => tCat.key === ticket_tier
              )?.title || ticket_tier // Fallback to tier if title is null
            : SESSION_PRICING_CATEGORIES.find(
                (spCat: SessionPricingCategory) => spCat.key === type
              )?.title || type;

        if (!acc[key]) {
          acc[key] = {
            title: title as string,
            currency: currencies?.find((cur: Currency) => cur.id === currency)
              ?.code as string,
            count: 0,
            cost: "0",
            date: "22/03/2024",
          };
        }

        acc[key].count++;
        acc[key].cost = (parseFloat(acc[key].cost) + parseFloat(cost)).toFixed(
          2
        );

        return acc;
      },
      {}
    );

    return grouped ? Object.values(grouped) : [];
  };

  useEffect(() => {
    getCurrencies();
    getTicketBookingOrderById(params?.bookingId);
  }, []);

  return (
    <div>
      <MobileMiniAppBar title="Payment" />
      {fetchingBookingRequestProcessing ? (
        <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto py-6 md:py-10 px-4 md:px-7">
          <div className="w-full lg:w-1/2 border border-gray-400 py-4 md:py-6 px-6 shadow-sm animate-pulse rounded mb-2 md:mb-0">
            <div className="h-6 bg-gray-300 rounded w-1/3  mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-full mb-3"></div>
            <div className="w-full border-collapse">
              <div className="w-full flex justify-between border-b pb-2">
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/6"></div>
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
              </div>
              <div className="w-full flex items-center border-b py-3">
                <div className="w-12 h-12 bg-gray-300 rounded mr-4"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/6"></div>
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
              </div>
            </div>

            {/* Discount Code */}
            <div className="flex items-center py-6 mb-4 w-full border-b border-t">
              <div className="flex-1 h-10 bg-gray-300 rounded"></div>
              <div className="w-24 h-10 bg-gray-300 rounded ml-2"></div>
            </div>

            {/* Pricing */}
            <div className="flex justify-between w-full mb-2">
              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            </div>
            <div className="border-t mt-4 pt-4 flex justify-between text-lg font-semibold">
              <div className="h-5 bg-gray-300 rounded w-1/4"></div>
              <div className="h-5 bg-gray-300 rounded w-1/4"></div>
            </div>
          </div>
          <div className="w-full lg:w-1/2 border border-gray-400 py-4 md:py-6 px-6 shadow-sm animate-pulse rounded">
            <div className="h-6 bg-gray-300 rounded w-1/3 mx-auto mb-4"></div>

            {/* Payment Options */}
            <div className="flex gap-4 mb-4">
              <div className="h-4 bg-gray-300 rounded w-1/6"></div>
              <div className="h-4 bg-gray-300 rounded w-1/6"></div>
              <div className="h-4 bg-gray-300 rounded w-1/6"></div>
            </div>

            {/* Payment Inputs */}
            <div className="mb-4 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
              <div className="h-10 bg-gray-300 rounded"></div>
            </div>
            <div className="flex gap-4 mb-4">
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                <div className="h-10 bg-gray-300 rounded"></div>
              </div>
              <div className="w-1/3 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="h-10 bg-gray-300 rounded"></div>
              </div>
            </div>

            <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mt-4"></div>
            <div className="h-10 bg-gray-300 rounded w-full mt-6"></div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto py-6 md:py-10 px-4 md:px-7">
          <div className="w-full lg:w-1/2 border border-gray-400 rounded py-4 md:py-6 px-6">
            <h2 className="text-xl font-medium">Order Summary</h2>
            <p className="font-base mb-3">
              Check your items and verify the information before proceeding to
              pay
            </p>
            <div className="mb-3">
              {groupTickets(ticketBookingOrder?.tickets).map(
                (ticket: GroupedTicket, index: number) => (
                  <div key={index} className="mb-3 last:mb-0">
                    <div className="flex flex-col md:flex-row overflow-hidden">
                      <div className="flex items-center md:w-[200px] border border-gray-300 rounded px-4">
                        <div className="me-4">
                          <Image
                            alt="Ticket Type Profile"
                            src={`${
                              ticket?.title === "Cost per Session" ||
                              ticket?.title === "Early bird"
                                ? "/assets/grey-ticket.svg"
                                : ticket?.title === "Standard" ||
                                  ticket?.title === "Day Pass"
                                ? "/assets/primary-ticket.svg"
                                : ticket?.title === "VIP" ||
                                  ticket?.title === "Monthly Subscription"
                                ? "/assets/yellow-ticket.svg"
                                : ticket?.title === "VVIP"
                                ? "/assets/brown-ticket.svg"
                                : "/assets/brown-ticket.svg"
                            }`}
                            width={isMobile ? 35 : 40}
                            height={isMobile ? 35 : 40}
                            unoptimized={true}
                          />
                        </div>
                        <div className="py-1">
                          <h3 className="">{ticket?.title}</h3>
                          <p className="text-gray-500 text-sm">
                            KES {addCommaSeparators(parseInt(ticket?.cost))}
                          </p>
                        </div>
                      </div>

                      <div className="flex-1 px-4 py-2 flex justify-between items-center">
                        <div>
                          <h4 className="text-sm">
                            {ticket?.count} {ticket?.title} Ticket(s) for the
                            Eras tour, tylor swift concert
                          </h4>

                          <div className="mt-2 flex justify-between items-center">
                            <div className="font-medium">
                              <span className="font-medium">Total Price: </span>
                              <span className="text-green-600">
                                {ticket?.currency}{" "}
                                {(
                                  parseInt(ticket?.cost) * ticket?.count
                                ).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-xs">
                            {ticket.date}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Pricing */}
            <div className="w-fullborders  border border-gray-300 rounded py-4 md:py-6 px-6">
              <div className="flex justify-center">
                <h1 className="text-xl font-semibold">Total Due</h1>
              </div>

              <div className="flex justify-between text-lg font-semibold">
                <span className="font-light">TOTAL</span>
                <span className="text-green-600">
                  {baseCurrency}{" "}
                  {addCommaSeparators(ticketBookingOrder?.total_price)}
                </span>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 border border-gray-400 py-4 md:py-6 px-6 rounded">
            <h2 className="text-xl font-medium">Payment</h2>
            <p className="font-base mb-3">
              Complete your purcharse by providing payment details
            </p>

            {/* <div className="flex gap-4 mb-4">
              {["card", "mpesa"].map((method) => (
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
                    className="text-[#FC8135] focus:ring-[#FC8135] border-gray-300"
                  />
                  {method.charAt(0).toUpperCase() + method.slice(1)}
                </label>
              ))}
            </div> */}

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

                <div className="mb-4 space-y-2">
                  <label className="block text-sm">Name on Card</label>
                  <input
                    type="text"
                    placeholder=""
                    className="outline-none border border-gray-300 rounded w-full p-2 "
                  />
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    id="saveCard"
                    className="accent-green-600"
                  />
                  <label htmlFor="saveCard" className="text-sm text-gray-400">
                    Save card details
                  </label>
                </div>
              </>
            )}
            {paymentMethod === "mpesa" && (
              <div className="mb-4 space-y-2">
                <label className="block text-sm">Mpesa Number</label>
                <input
                  type="text"
                  className="outline-none border border-gray-300 rounded w-full p-2 "
                />
              </div>
            )}
            {/* Pay Button */}
            <Button
              padding="py-3"
              margin="mt-4"
              borderRadius="rounded"
              text="w-full font-medium text-white"
              bg="bg-primary"
              onClick={() => setActiveModal(ModalID.successfullPayment)}
            >
              Pay {baseCurrency}{" "}
              {addCommaSeparators(
                ticketBookingOrder?.ticket_summary?.ticket?.total_price
              )}
            </Button>

            <p className="text-xs text-gray-400 mt-4 text-center">
              Your personal data will be used to process your order and support
              your experience as described in our privacy policy.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

CheckoutPage.layout = DashBoardLayout;

const mapStateToProps = (state: RootState) => {
  const fetchingBookingRequestProcessing =
    state.loading.effects.tickets.getTicketBookingOrderById;
  const { ticketBookingOrder } = state.tickets;
  const { currencies } = state.settings;
  return {
    fetchingBookingRequestProcessing,
    currencies,
    ticketBookingOrder,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getCurrencies: () => dispatch.settings.getCurrencies(),
  setActiveModal: (modalId: ModalID) =>
    dispatch.components.setActiveModal(modalId),
  getTicketBookingOrderById: (bookingId: string) =>
    dispatch.tickets.getTicketBookingOrderById(bookingId),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAuth(CheckoutPage));
