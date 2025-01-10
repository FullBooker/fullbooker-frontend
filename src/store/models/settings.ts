import { createModel } from "@rematch/core";

import type { RootModel } from ".";
import {
  getRequest,
} from "../../utilities";

type SettingsState = {
  paymentMethods: Array<string>;
  transactionTypes: Array<string>;
  transactionStatuses: Array<string>;
};

export const settings = createModel<RootModel>()({
  state: {
    paymentMethods: [],
    transactionTypes: [],
    transactionStatuses: []
  } as SettingsState,
  reducers: {
    setPaymentMethods(state: SettingsState, paymentMethods: Array<string>) {
      return {
        ...state,
        paymentMethods,
      };
    },
    setTransactionTypes(
      state: SettingsState,
      transactionTypes: Array<string>
    ) {
      return {
        ...state,
        transactionTypes,
      };
    },
    setTransactionStatuses(state: SettingsState, transactionStatuses: Array<string>) {
      return {
        ...state,
        transactionStatuses,
      };
    },
  },
  effects: (dispatch) => ({
    async getPaymentMethods() {
      try {
        const response: any = await getRequest("/api/v1/transaction/history/payments/payment-methods");
        if (response) {
          dispatch.settings.setPaymentMethods(
            response?.data?.data ? response?.data?.data : []
          );
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(error?.message);
      }
    },
    async getTransactionTypes() {
      try {
        const response: any = await getRequest(
          "/api/v1/transaction/history/payments/transaction-types"
        );
        if (response) {
          dispatch.settings.setTransactionTypes(
            response?.data?.data ? response?.data?.data : []
          );
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(error?.message);
      }
    },
     async getTransactionStatuses() {
      try {
        const response: any = await getRequest(
          "/api/v1/transaction/history/payments/transaction-status"
        );
        if (response) {
          dispatch.settings.setTransactionStatuses(
            response?.data?.data ? response?.data?.data : []
          );
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(error?.message);
      }
    },
  }),
});
