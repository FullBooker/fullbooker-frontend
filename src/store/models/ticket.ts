import { BookTicketPayload, TicketFilters } from "@/domain/dto/ticket";
import type { RootModel } from ".";
import { buildQueryString, getRequest, postRequest } from "../../utilities";

import { createModel } from "@rematch/core";
import { Ticket, TicketBookingOrder } from "@/domain/ticket";
import { CustomeEvents } from "@/constants";

type TicketState = {
  tickets: Array<Ticket>;
  ticket: Ticket | null;
  ticketBookingOrder: TicketBookingOrder | null;
};

export const tickets = createModel<RootModel>()({
  state: {
    tickets: [],
    ticket: null,
    ticketBookingOrder: null,
  } as TicketState,
  reducers: {
    setTickets(state: TicketState, tickets: Array<Ticket>) {
      return {
        ...state,
        tickets,
      };
    },
    setTicket(state: TicketState, ticket: Ticket) {
      return {
        ...state,
        ticket,
      };
    },
    setTicketBookingOrder(
      state: TicketState,
      ticketBookingOrder: TicketBookingOrder
    ) {
      return {
        ...state,
        ticketBookingOrder,
      };
    },
  },
  effects: (dispatch: any) => ({
    async bookTicket(payload: BookTicketPayload) {
      try {
        const response: any = await postRequest("/bookings/", payload);

        if (response && response) {
          const ticketBookingOrder: TicketBookingOrder = response?.data;
          dispatch.alert.setSuccessAlert("Booking created successfully!");
          const ticketBookingSuccessfullEvent = new CustomEvent(
            CustomeEvents.successfullTicketBooking,
            {
              detail: {
                booking_id: ticketBookingOrder?.id,
              },
              bubbles: true,
              cancelable: true,
            }
          );
          document.dispatchEvent(ticketBookingSuccessfullEvent);
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(error?.message);
      }
    },
    async getTickets(payload: TicketFilters) {
      try {
        const response: any = await getRequest(
          payload ? `/tickets/?${buildQueryString(payload)}` : "/tickets/"
        );

        if (response && response?.data) {
          dispatch.tickets.setTickets(response?.data?.results as Array<Ticket>);
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(error?.message);
      }
    },
    async getTicketById(ticketId: string) {
      try {
        const response: any = await getRequest(`/tickets/${ticketId}/`);

        if (response && response?.data) {
          dispatch.tickets.setTicket(response?.data as Ticket);
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(error?.message);
      }
    },
    async getTicketBookingOrderById(bookingId: string) {
      try {
        const response: any = await getRequest(`/bookings/${bookingId}/`);

        if (response && response?.data) {
          dispatch.tickets.setTicketBookingOrder(
            response?.data as TicketBookingOrder
          );
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(error?.message);
      }
    },
  }),
});
