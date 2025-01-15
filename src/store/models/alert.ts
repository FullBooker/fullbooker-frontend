import { createModel } from "@rematch/core";
import type { RootModel } from ".";
import { NotificationType } from "../../domain/notification";

type AlertState = {
  type: NotificationType | null;
  message: string | null;
};

export const alert = createModel<RootModel>()({
  state: {
    type: null,
    message: null,
  } as AlertState,
  reducers: {
    setFailureAlert(state:AlertState, message: string) {
      return {
        ...state,
        type: NotificationType.failure,
        message: message,
      };
    },
    setAlert(state:AlertState, payload: any) {
      return {
        ...state,
        type: payload?.type,
        message: payload?.message,
      };
    },
    setSuccessAlert(state:AlertState, message: string) {
      return {
        ...state,
        type: NotificationType.success,
        message: message,
      };
    },
    clearAlert(state:AlertState) {
      return {
        ...state,
        type: null,
        message: null,
      };
    },
  },
  effects: (dispatch: any) => ({}),
});
