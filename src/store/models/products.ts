import type { RootModel } from ".";
import { createModel } from "@rematch/core";
import { ProductsFilters } from "@/domain/dto/input";
import { buildQueryString, getRequest } from "@/utilities";
import { Product, ProductMedia } from "@/domain/product";

type ProductsState = {
  products: Array<Product>;
  product: Product | null;
  productMedia: Array<ProductMedia>;
};

export const products = createModel<RootModel>()({
  state: {
    products: [],
    product: null,
    productMedia: [],
  } as ProductsState,
  reducers: {
    setProductDetails(state: ProductsState, product: Product) {
      return {
        ...state,
        product,
      };
    },
    setProducts(state: ProductsState, products: Array<Product>) {
      return {
        ...state,
        products,
      };
    },
    setProductMedia(state: ProductsState, productMedia: Array<ProductMedia>) {
      return {
        ...state,
        productMedia,
      };
    },
  },
  effects: (dispatch: any) => ({
    async getProducts(payload: ProductsFilters, rootState) {
      try {
        const response: any = await getRequest(
          payload ? `/products/?${buildQueryString(payload)}` : "/products/"
        );

        if (response && response?.data) {
          dispatch.products.setProducts(response?.data);
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(error?.message);
      }
    },
    async getProductsByVendor(payload: ProductsFilters, rootState) {
      try {
        const response: any = await getRequest(
          payload ? `/products/?${buildQueryString(payload)}` : "/products/"
        );

        if (response && response?.data) {
          dispatch.products.setProducts(response?.data);
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(error?.message);
      }
    },
    async getProductById(id: string, rootState) {
      try {
        const response: any = await getRequest(`/products/${id}/`);

        if (response && response?.data) {
          dispatch.products.setProductDetails(response?.data);
          dispatch.products.getProductMedia(id);
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(error?.message);
      }
    },
    async getProductMedia(productId: string, rootState) {
      try {
        const response: any = await getRequest(
          `/media/?product_id=${productId}`
        );
        if (response && response?.data) {
          dispatch.products.setProductMedia(response?.data);
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(error?.message);
      }
    },
  }),
});
