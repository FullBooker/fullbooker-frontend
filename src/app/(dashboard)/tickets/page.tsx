"use client";
import React, { FC, useEffect } from "react";
import { ModalID } from "@/domain/components";
import { RootState } from "@/store";
import { connect } from "react-redux";
import { TicketFilters } from "@/domain/dto/ticket";
import { Ticket } from "@/domain/ticket";
import { withAuth } from "../../../components/views/dash/authGuard";
import { ChevronLeft } from "lucide-react";
import MobileMiniAppBar from "@/components/layout/mobileMiniAppBar";
import Link from "next/link";
import Image from "next/image";
import useIsMobile from "@/lib/hooks/useIsMobile";
import { convertToHumanReadableTime, humanReadableDate } from "@/utilities";
import NoRecords from "@/components/vendor/products/shared/no-records";

type MyTicketsPageProps = {
  isProcessingRequest: boolean;
  tickets: Array<Ticket>;
  getTickets: (filters?: TicketFilters) => void;
};

const MyTicketsPage: FC<MyTicketsPageProps> = ({
  tickets,
  getTickets,
  isProcessingRequest,
}) => {
  const isMobile = useIsMobile();
  useEffect(() => {
    getTickets();
  }, []);
  return (
    <div className="h-fit md:max-w-6xl mx-auto">
      <MobileMiniAppBar title="My Tickets" />
      <div className="flex flex-col gap-12 h-fit py-3 md:py-10 px-4 max-w-7xl mx-auto">
        {isProcessingRequest ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(isMobile ? 10 : 12)].map((_, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-6 rounded-lg cursor-pointer shadow animate-pulse bg-gray-200"
              >
                <div className="flex items-center">
                  <div className="me-4 bg-gray-300 rounded w-[40px] h-[40px]"></div>
                  <div>
                    <div className="h-4 w-24 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 w-32 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : tickets.length === 0 ? (
          <NoRecords message="Oops! You have no tickets at the moment" />
        ) : (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tickets.map((ticket: Ticket, index: number) => (
                <Link
                  key={index}
                  href={`/product/booking/ticket/${ticket?.id}`}
                  className={`flex justify-between items-center p-6 rounded-lg cursor-pointer shadow `}
                >
                  <div className="flex items-center">
                    <div className="me-4">
                      <Image
                        alt="Ticket Type Profile"
                        src={`${
                          // title === "Cost per Session" || title === "Early bird"
                          //   ? "/assets/grey-ticket.svg"
                          //   : title === "Standard" || title === "Day Pass"
                          //   ? "/assets/primary-ticket.svg"
                          //   : title === "VIP" ||
                          //     title === "Monthly Subscription"
                          //   ? "/assets/yellow-ticket.svg"
                          //   : title === "VVIP"
                          //   ? "/assets/brown-ticket.svg"
                          //   :
                          "/assets/brown-ticket.svg"
                        }`}
                        width={isMobile ? 35 : 40}
                        height={isMobile ? 35 : 40}
                        unoptimized={true}
                      />
                    </div>
                    <div>
                      <span className="text-sm">{ticket?.number}</span>
                      {/* <p className="text-xs text-[#808080]">
                        {
                          currencies?.find(
                            (currency: Currency) =>
                              currency.id === pricing?.currency
                          )?.code
                        }{" "}
                        {addCommaSeparators(
                          Math.round(parseInt(pricing?.cost))
                        )}
                      </p>
                      */}
                      <p className="text-xs text-gray-500">
                        {`${humanReadableDate(
                          ticket?.start
                        )} - ${humanReadableDate(ticket?.end)}`}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const isProcessingRequest = state.loading.effects.tickets.getTickets;
  const { tickets } = state.tickets;
  return {
    tickets,
    isProcessingRequest,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  setActiveModal: (modalId: ModalID) =>
    dispatch.components.setActiveModal(modalId),
  getTickets: (filters?: TicketFilters) => dispatch.tickets.getTickets(filters),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAuth(MyTicketsPage));
