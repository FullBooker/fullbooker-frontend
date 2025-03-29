import {
  Currency,
  DayOfWeek,
  ProductCategory,
  ProductTag,
} from "@/domain/dto/output";
import type { RootModel } from ".";
import { createModel } from "@rematch/core";
import { buildQueryString, getRequest } from "@/utilities";
import { ProductTagsFilters } from "@/domain/dto/input/settings.input";

type SettingsState = {
  productCategories: Array<ProductCategory>;
  daysOfWeek: Array<DayOfWeek>;
  currencies: Array<Currency>;
  productTags: Array<ProductTag>;
};

export const settings = createModel<RootModel>()({
  state: {
    productCategories: [],
    daysOfWeek: [],
    currencies: [],
    productTags: [],
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
    setProductTags(state: SettingsState, productTags: Array<ProductTag>) {
      return {
        ...state,
        productTags,
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
    async getProductCategories() {
      try {
        const response: any = await getRequest("/categories/");

        if (response && response?.data) {
          dispatch.settings.setProductCategories(response?.data?.results);
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(error?.message);
      }
    },
    async getProductTags(payload: ProductTagsFilters, rootState) {
      try {
        const response: any = await getRequest(
          `/tags/?${buildQueryString(payload)}`
        );

        if (response && response?.data) {
          dispatch.settings.setProductTags(response?.data?.results);
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(error?.message);
      }
    },
    async getDaysOfWeek(payload, rootState) {
      try {
        const response: any = await getRequest("/days-of-week/");

        if (response && response?.data) {
          dispatch.settings.setDaysOfWeek(response?.data?.results);
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(error?.message);
      }
    },
    async getCurrencies() {
      try {
        const response: any = await getRequest("/currencies/");

        if (response && response?.data) {
          dispatch.settings.setCurrencies(response?.data?.results);
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(error?.message);
      }
    },
  }),
});
