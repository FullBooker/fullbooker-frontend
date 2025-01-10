import { createModel } from "@rematch/core";
import type { RootModel } from ".";
import { ModalID } from "../../domain/components";

type ComponentsState = {
  showOffCanvas: boolean;
  modalId: ModalID;
};

export const components = createModel<RootModel>()({
  state: {
    showOffCanvas: false,
    modalId: ModalID.none,
  } as ComponentsState,
  reducers: {
    setOffCanvasVisibility(state: ComponentsState, show: boolean) {
      return {
        ...state,
        showOffCanvas: show,
      };
    },
    setActiveModal(state: ComponentsState, modalId: ModalID) {
      return {
        ...state,
        modalId
      };
    },
  },
});
