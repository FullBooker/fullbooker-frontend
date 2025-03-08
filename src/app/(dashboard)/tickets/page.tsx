"use client";
import React, { FC, useEffect } from "react";
import { ModalID } from "@/domain/components";
import { RootState } from "@/store";
import { connect } from "react-redux";
import { TicketFilters } from "@/domain/dto/ticket";
import { Ticket } from "@/domain/ticket";
import { withAuth } from "../../../components/views/dash/authGuard";
import { ChevronLeft } from "lucide-react";

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
  useEffect(() => {
    getTickets();
  }, []);
  return (
    <div className="h-fit md:max-w-6xl mx-auto">
      <div className="flex justify-between items-center md:justify-center mb-2 px-4 py-3 shadow md:hidden">
        <div className="flex justify-between items-center">
          <p className="font-semibold text-lg">My Tickets</p>
        </div>
      </div>
      {isProcessingRequest ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-4 animate-pulse px-4 md:px-7">
          {[...Array(6)].map((_, index) => (
            <div className="">
              {/* Left Section */}
              <div>
                <div className="h-6 w-48 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 w-32 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 w-40 bg-gray-300 rounded mb-2"></div>
                <div className="h-6 w-24 bg-gray-300 rounded"></div>
              </div>

              {/* Right Button */}
              <div className="text-right">
                <div className="h-10 w-24 bg-gray-300 rounded-lg inline-block"></div>
              </div>

              {/* Host Info */}
              <div className="hidden md:flex justify-end items-start">
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-gray-300 rounded-lg me-2"></div>
                  <div>
                    <div className="h-4 w-20 bg-gray-300 rounded mb-1"></div>
                    <div className="h-4 w-28 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : tickets.length === 0 ? (
        <div>
          <div className=" text-red-500 h-screen grid place-items-center text-center">
            <p>No tickets found.</p>
          </div>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tickets.map((ticket: Ticket, index: number) => (
              <div key={index} className="border rounded-lg p-4 shadow-sm">
                <h3 className="text-lg font-medium">{}</h3>
                <p className="text-sm text-gray-600">{}</p>
                <p className="text-sm text-gray-600">{}</p>
              </div>
            ))}
          </div>
        </div>
      )}
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
