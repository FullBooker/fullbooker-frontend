import {
  ProductCategory,
  VendorDetails,
  VendorProductsAPIResponse,
} from "@/domain/dto/output";
import type { RootModel } from ".";
import { createModel } from "@rematch/core";
import {
  ActivateProductPayload,
  AddProductLocationPayload,
  DeleteProductMediaPayload,
  NewProductPayload,
  PauseProductPayload,
  ProductAvailabilityPayload,
  ProductMediaPayload,
  ProductPricingPayload,
  UpdateProductAvailabilityPayload,
  UpdateProductLocationPayload,
  UpdateProductPayload,
  UpdateProductPricingPayload,
  VendorProductsFilters,
} from "@/domain/dto/input";
import { MediaType, ProductType, ViewType } from "@/domain/constants";
import {
  buildQueryString,
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
  putRequest,
} from "@/utilities";
import { Product, ProductMedia } from "@/domain/product";
import { ModalID } from "@/domain/components";

type VendorState = {
  vendorDetails: VendorDetails;
  newProduct: NewProductPayload | null;
  activeStep: number;
  vendorProducts: VendorProductsAPIResponse;
  productPageViewType: ViewType;
  productType: ProductType;
  productMedia: Array<ProductMedia>;
};

export const vendor = createModel<RootModel>()({
  state: {
    vendorDetails: {} as VendorDetails,
    newProduct: null,
    activeStep: 0,
    vendorProducts: {
      results: [],
    } as VendorProductsAPIResponse,
    productPageViewType: ViewType.productsListView,
    productType: ProductType.default,
    productMedia: [],
  } as VendorState,
  reducers: {
    setVendorDetails(state: VendorState, vendorDetails: VendorDetails) {
      return {
        ...state,
        vendorDetails,
      };
    },
    setNewProductDetails(
      state: VendorState,
      newProduct: NewProductPayload | null
    ) {
      return {
        ...state,
        newProduct,
      };
    },
    setActiveStep(state: VendorState, activeStep: number) {
      return {
        ...state,
        activeStep,
      };
    },
    setVendorProducts(
      state: VendorState,
      vendorProducts: VendorProductsAPIResponse
    ) {
      return {
        ...state,
        vendorProducts,
      };
    },
    setProductPageViewType(state: VendorState, productPageViewType: ViewType) {
      return {
        ...state,
        productPageViewType,
      };
    },
    setProductType(state: VendorState, productType: ProductType) {
      return {
        ...state,
        productType,
      };
    },
    setProductMedia(state: VendorState, productMedia: Array<ProductMedia>) {
      return {
        ...state,
        productMedia,
      };
    },
  },
  effects: (dispatch: any) => ({
    async registerProduct(payload: NewProductPayload, rootState) {
      try {
        const response: any = await postRequest("/products/", payload);
        if (response && response?.data) {
          const product: Product = response?.data;
          const url = new URL(window.location.href);
          url.searchParams.set("product_id", product?.id);
          window.history.pushState({}, "", url);
          const previousStep = rootState.vendor.activeStep;
          dispatch.vendor.setNewProductDetails(product);
          dispatch.vendor.setActiveStep(previousStep + 1);
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(
          error?.data?.identifier[0] || error?.message
        );
      }
    },
    async updateProduct(payload: UpdateProductPayload, rootState) {
      try {
        const response: any = await putRequest(
          `/products/${payload?.id}/`,
          payload
        );
        if (response && response?.data) {
          const previousStep = rootState.vendor.activeStep;
          dispatch.vendor.setNewProductDetails(response?.data);
          dispatch.vendor.setActiveStep(previousStep + 1);
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(
          error?.data?.identifier[0] || error?.message
        );
      }
    },
    async getVendorProducts(payload: VendorProductsFilters, rootState) {
      try {
        const response: any = await getRequest(
          payload ? `/products/?${buildQueryString(payload)}` : "/products/"
        );

        if (response && response?.data) {
          dispatch.vendor.setVendorProducts(response?.data);
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(error?.message);
      }
    },
    async getVendorProductById(id: string, rootState) {
      try {
        const response: any = await getRequest(`/products/${id}/`);

        if (response && response?.data) {
          const product = response?.data as Product;
          if (product.category) {
            const isEvent = rootState.settings.productCategories
              .find(
                (category: ProductCategory) => category.id === product.category
              )
              ?.name?.includes("Event");
            dispatch.vendor.setProductType(
              isEvent ? ProductType.event : ProductType.others
            );
          }
          dispatch.vendor.setNewProductDetails(response?.data);
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(error?.message);
      }
    },
    async uploadProductMedia(payload: ProductMediaPayload, rootState) {
      try {
        const response: any = await postRequest("/media/", payload, true);
        if (response && response?.data) {
          dispatch.vendor.getVendorProductById(payload?.product_id);
          dispatch.vendor.getProductMedia(payload?.product_id);
          dispatch.alert.setSuccessAlert(
            `${
              payload?.media_type === MediaType.image ? "Photo" : "Video"
            } uploaded successfully!`
          );
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(
          error?.data?.identifier[0] || error?.message
        );
      }
    },
    async getProductMedia(productId: string, rootState) {
      try {
        const response: any = await getRequest(
          `/media/?product_id=${productId}`
        );
        if (response && response?.data) {
          dispatch.vendor.setProductMedia(response?.data?.results);
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(error?.message);
      }
    },
    async addProductLocation(payload: AddProductLocationPayload, rootState) {
      try {
        const response: any = await postRequest("/location/", payload);
        if (response && response?.data) {
          dispatch.vendor.getVendorProductById(payload?.product);
          dispatch.alert.setSuccessAlert(
            "Product location added successfully!"
          );
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(
          error?.data?.address
            ? `Address: ${error?.data?.address}`
            : error?.data?.detail || error?.message
        );
      }
    },
    async updateProductLocation(
      payload: UpdateProductLocationPayload,
      rootState
    ) {
      try {
        const response: any = await putRequest(
          `/location/${payload?.id}/`,
          payload
        );
        if (response && response?.data) {
          dispatch.vendor.getVendorProductById(payload?.product);
          dispatch.alert.setSuccessAlert(
            "Product location updated successfully!"
          );
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(
          error?.data?.address
            ? `Address: ${error?.data?.address}`
            : error?.data?.detail || error?.message
        );
      }
    },
    async addProductAvailability(
      payload: ProductAvailabilityPayload,
      rootState
    ) {
      try {
        const response: any = await postRequest("/availability/", payload);
        if (response && response?.data) {
          dispatch.vendor.getVendorProductById(payload?.product);
          dispatch.alert.setSuccessAlert(
            "Product availability added successfully!"
          );
          const previousStep = rootState.vendor.activeStep;
          dispatch.vendor.setActiveStep(previousStep + 1);
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(
          error?.data?.identifier[0] || error?.message
        );
      }
    },
    async updateProductAvailability(
      payload: UpdateProductAvailabilityPayload,
      rootState
    ) {
      try {
        const response: any = await patchRequest(
          `/availability/${payload?.id}/`,
          {
            ...payload,
            product: undefined,
          }
        );
        if (response && response?.data) {
          dispatch.vendor.getVendorProductById(payload?.product);
          dispatch.alert.setSuccessAlert(
            "Product availability updated successfully!"
          );
          const previousStep = rootState.vendor.activeStep;
          dispatch.vendor.setActiveStep(previousStep + 1);
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(error?.include || error?.message);
      }
    },
    async deleteProductMedia(payload: DeleteProductMediaPayload, rootState) {
      try {
        const response: any = await deleteRequest(
          `/media/${payload?.file_id}/`
        );
        if (response) {
          dispatch.vendor.getVendorProductById(payload?.product_id);
          dispatch.vendor.getProductMedia(payload?.product_id);
          dispatch.alert.setSuccessAlert(
            `${
              payload?.media_type === MediaType.image ? "Photo" : "Video"
            } deleted successfully!`
          );
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(
          error?.data?.identifier[0] || error?.message
        );
      }
    },
    async addProductPricing(payload: ProductPricingPayload, rootState) {
      try {
        const response: any = await postRequest("/pricing/", payload);
        if (response && response?.data) {
          dispatch.vendor.getVendorProductById(payload?.product);
          dispatch.alert.setSuccessAlert("Product pricing added successfully!");
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(
          error?.data?.identifier[0] || error?.message
        );
      }
    },
    async updateProductPricing(
      payload: UpdateProductPricingPayload,
      rootState
    ) {
      try {
        const response: any = await patchRequest(
          `/pricing/${payload?.id}/`,
          payload
        );
        if (response && response?.data) {
          dispatch.vendor.getVendorProductById(payload?.product);
          dispatch.alert.setSuccessAlert(
            "Product pricing updated added successfully!"
          );
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(
          error?.data?.identifier[0] || error?.message
        );
      }
    },
    async deleteProduct(productId: string, rootState) {
      try {
        const response: any = await deleteRequest(`/products/${productId}/`);
        if (response && response?.status === 204) {
          dispatch.components.setActiveModal(ModalID.none);
          dispatch.vendor.setNewProductDetails(null);
          dispatch.vendor.setProductPageViewType(ViewType.productsListView);
          dispatch.alert.setSuccessAlert("Product deleted successfully!");
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(
          error?.data?.identifier[0] || error?.message
        );
      }
    },
    async pauseProduct(payload: PauseProductPayload, rootState) {
      try {
        const response: any = await patchRequest(
          `/products/${payload?.product}/`,
          {
            active: payload?.active,
          }
        );
        if (response && response?.data) {
          dispatch.components.setActiveModal(ModalID.none);
          dispatch.vendor.setNewProductDetails(null);
          dispatch.vendor.setProductPageViewType(ViewType.productsListView);
          dispatch.alert.setSuccessAlert("Product paused successfully!");
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(
          error?.data?.identifier[0] || error?.message
        );
      }
    },
    async activateProduct(payload: ActivateProductPayload, rootState) {
      try {
        const response: any = await patchRequest(
          `/products/${payload?.product}/`,
          {
            active: payload?.active,
          }
        );
        if (response && response?.data) {
          dispatch.components.setActiveModal(ModalID.none);
          dispatch.vendor.setNewProductDetails(null);
          dispatch.vendor.setProductPageViewType(ViewType.productsListView);
          dispatch.alert.setSuccessAlert("Product activated successfully!");
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(
          error?.data?.identifier[0] || error?.message
        );
      }
    },
  }),
});
