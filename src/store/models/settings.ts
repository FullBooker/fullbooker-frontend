import {
  Currency,
  DayOfWeek,
  ProductCategory,
  VendorDetails,
} from "@/domain/dto/output";
import type { RootModel } from ".";
import { createModel } from "@rematch/core";
import { NewProductPayload } from "@/domain/dto/input";
import { getRequest } from "@/utilities";

type SettingsState = {
  productCategories: Array<ProductCategory>;
  daysOfWeek: Array<DayOfWeek>;
  currencies: Array<Currency>;
};

export const settings = createModel<RootModel>()({
  state: {
    productCategories: [],
    daysOfWeek: [],
    currencies: [],
  } as SettingsState,
  reducers: {
    setProductCategories(
      state: SettingsState,
      productCategories: Array<ProductCategory>
    ) {
      return {
        ...state,
        productCategories,
      };
    },
    setDaysOfWeek(state: SettingsState, daysOfWeek: Array<DayOfWeek>) {
      return {
        ...state,
        daysOfWeek,
      };
    },
    setCurrencies(state: SettingsState, currencies: Array<Currency>) {
      return {
        ...state,
        currencies,
      };
    },
  },
  effects: (dispatch: any) => ({
    async getProductCategories(payload, rootState) {
      try {
        const response: any = await getRequest("/categories/");

        if (response && response?.data) {
          dispatch.settings.setProductCategories(response?.data);
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(error?.message);
      }
    },
    async getDaysOfWeek(payload, rootState) {
      try {
        const response: any = await getRequest("/days-of-week/");

        if (response && response?.data) {
          dispatch.settings.setDaysOfWeek(response?.data);
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(error?.message);
      }
    },
    async getCurrencies(payload, rootState) {
      try {
        const response: any = await getRequest("/currencies/");

        if (response && response?.data) {
          dispatch.settings.setCurrencies(response?.data);
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(error?.message);
      }
    },
  }),
});
