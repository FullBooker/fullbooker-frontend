import { NewTicketPayload, TicketFilters } from "@/domain/dto/ticket";
import type { RootModel } from ".";
import { buildQueryString, getRequest, postRequest } from "../../utilities";

import { createModel } from "@rematch/core";
import { Ticket } from "@/domain/ticket";

type TicketState = {
  tickets: Array<Ticket>;
};

export const tickets = createModel<RootModel>()({
  state: {
    tickets: [],
  } as TicketState,
  reducers: {
    setTickets(state: TicketState, tickets: Array<Ticket>) {
      return {
        ...state,
        tickets,
      };
    },
  },
  effects: (dispatch: any) => ({
    async bookTicket(payload: Array<NewTicketPayload>) {
      try {
        const response: any = await postRequest("/tickets/", payload);

        if (response && response?.data?.success) {
          dispatch.alert.setSuccessAlert(response?.data?.message);
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
          dispatch.tickets.setTickets(
            response?.data?.results as Array<Ticket>
          );
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(error?.message);
      }
    },
  }),
});
