import type { RootModel } from ".";
import { createModel } from "@rematch/core";
import { ProductsFilters } from "@/domain/dto/input";
import { buildQueryString, getRequest } from "@/utilities";
import { CartItem, CartSummary, Product, ProductMedia } from "@/domain/product";
import { ComprehensiveProductFilters } from "@/domain/dto/product.input";
import { County } from "@/domain/location";

type ProductsState = {
  products: Array<Product>;
  product: Product | null;
  popularProducts: Array<Product>;
  nearByProducts: Array<Product>;
  recommendedProducts: Array<Product>;
  upcomingProducts: Array<Product>;
  productMedia: Array<ProductMedia>;
  cart: Array<CartItem>;
  cartSummary: CartSummary | null;
  comprehensiveProductFilters: ComprehensiveProductFilters | null;
};

export const products = createModel<RootModel>()({
  state: {
    products: [],
    product: null,
    popularProducts: [],
    nearByProducts: [],
    recommendedProducts: [],
    upcomingProducts: [],
    productMedia: [],
    cart: [],
    cartSummary: null,
    comprehensiveProductFilters: {
      keyword: "",
      locations: [],
      categoies: [],
      start_date: "",
      end_date: "",
      max_price: "0",
      min_price: "0",
    },
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
    setPopularProducts(state: ProductsState, popularProducts: Array<Product>) {
      return {
        ...state,
        popularProducts,
      };
    },
    setRecommendedProducts(
      state: ProductsState,
      recommendedProducts: Array<Product>
    ) {
      return {
        ...state,
        recommendedProducts,
      };
    },
    setNearByProducts(state: ProductsState, nearByProducts: Array<Product>) {
      return {
        ...state,
        nearByProducts,
      };
    },
    setUpcomingProducts(
      state: ProductsState,
      upcomingProducts: Array<Product>
    ) {
      return {
        ...state,
        upcomingProducts,
      };
    },
    setProductMedia(state: ProductsState, productMedia: Array<ProductMedia>) {
      return {
        ...state,
        productMedia,
      };
    },
    addToCart(state: ProductsState, item: CartItem) {
      const existingItem = state.cart.find(
        (cartItem) => cartItem.id === item.id
      );
      let updatedCart;

      if (!existingItem) {
        updatedCart = [...state.cart, item];
      } else {
        updatedCart = state.cart;
      }

      const updatedCartSummary = {
        ...state.cartSummary,
        total_items: updatedCart.length,
        total_price:
          parseFloat(state?.cartSummary?.product_base_price as string) *
          updatedCart.length,
      };

      return {
        ...state,
        cart: updatedCart,
        cartSummary: updatedCartSummary as CartSummary,
      };
    },
    addUserDetailsToCart(state: ProductsState, payload: CartItem) {
      const updatedCart = state.cart.map((cartItem) => {
        if (cartItem.id === payload.id) {
          return { ...cartItem, ...payload };
        }
        return cartItem;
      });

      return {
        ...state,
        cart: updatedCart,
      };
    },
    removeFromCart(state: ProductsState, id: string) {
      const itemToRemove = state.cart.find((item) => item.id === id);
      if (!itemToRemove) return state;

      const updatedCart = state.cart.filter((item) => item.id !== id);

      const updatedCartSummary = {
        ...state.cartSummary,
        total_items: updatedCart.length,
        total_price:
          parseFloat(state?.cartSummary?.product_base_price as string) *
          updatedCart.length,
      };

      return {
        ...state,
        cart: updatedCart,
        cartSummary: updatedCartSummary as CartSummary,
      };
    },
    clearCart(state: ProductsState) {
      return {
        ...state,
        cart: [],
        cartSummary: {
          prefill_all_items_with_primary_user_details: false,
          total_items: 0,
          total_price: 0,
        } as CartSummary,
      };
    },
    clearCartAndCartSummary(state: ProductsState) {
      return {
        ...state,
        cart: [],
        cartSummary: null,
      };
    },
    setProductDetailsToCart(state: ProductsState, cartSummary: CartSummary) {
      return {
        ...state,
        cartSummary,
      };
    },
    setComprehensiveeProductFilters(
      state: ProductsState,
      comprehensiveProductFilters: ComprehensiveProductFilters
    ) {
      return {
        ...state,
        comprehensiveProductFilters,
      };
    },
    toggleCategoryFilter(state: ProductsState, category: string) {
      const existingCategories =
        state.comprehensiveProductFilters?.categoies || [];
      const updatedCategories = existingCategories.includes(category)
        ? existingCategories.filter((cat) => cat !== category)
        : [...existingCategories, category];

      return {
        ...state,
        comprehensiveProductFilters: {
          ...state.comprehensiveProductFilters,
          categoies: updatedCategories,
        },
      };
    },
    toggleLocationFilter(state: ProductsState, location: County) {
      const existingLocations =
        state.comprehensiveProductFilters?.locations || [];
      const updatedLocations = existingLocations.some((loc) => loc === location)
        ? existingLocations.filter((loc) => loc !== location)
        : [...existingLocations, location];

      return {
        ...state,
        comprehensiveProductFilters: {
          ...state.comprehensiveProductFilters,
          locations: updatedLocations,
        },
      };
    },
    clearProductComprehensiveFilters(state: ProductsState) {
      return {
        ...state,
        comprehensiveProductFilters: {
          keyword: "",
          locations: [],
          categoies: [],
          start_date: "",
          end_date: "",
          max_price: "0",
          min_price: "0",
        },
      };
    },
    clearProductFilters(state: ProductsState) {
      return {
        ...state,
        productFilters: null,
      };
    },
  },
  effects: (dispatch: any) => ({
    async getProducts(payload: ProductsFilters, rootState) {
      try {
        const response: any = await getRequest(
          payload
            ? `/accounts/products/?${buildQueryString(payload)}`
            : "/accounts/products/"
        );

        if (response && response?.data) {
          dispatch.products.setProducts(response?.data?.results);
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(error?.message);
      }
    },
    async getPopularProducts(payload: any, rootState) {
      try {
        const response: any = await getRequest(
          payload
            ? `/accounts/products/popular?${buildQueryString(payload)}`
            : "/accounts/products/popular"
        );

        if (response && response?.data) {
          dispatch.products.setPopularProducts(response?.data?.results);
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(error?.message);
      }
    },
    async getRecommendedProducts(payload: any, rootState) {
      try {
        const response: any = await getRequest(
          payload
            ? `/accounts/products/popular?${buildQueryString(payload)}`
            : "/accounts/products/popular"
        );

        if (response && response?.data) {
          dispatch.products.setRecommendedProducts(response?.data?.results);
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(error?.message);
      }
    },
    async getNearByProducts(payload: any, rootState) {
      try {
        const response: any = await getRequest(
          payload
            ? `/accounts/products/nearby?${buildQueryString(
                payload
              )}&lat=1.2921&long=36.8219`
            : "/accounts/products/nearby"
        );

        if (response && response?.data) {
          dispatch.products.setNearByProducts(response?.data?.results);
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(error?.message);
      }
    },
    async getUpcomingProducts(payload: any, rootState) {
      try {
        const response: any = await getRequest(
          payload
            ? `/accounts/products/upcoming?${buildQueryString(payload)}`
            : "/accounts/products/upcoming"
        );

        if (response && response?.data) {
          dispatch.products.setUpcomingProducts(response?.data?.results);
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
          dispatch.products.setProducts(response?.data?.results);
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(error?.message);
      }
    },
    async getProductById(id: string, rootState) {
      try {
        const response: any = await getRequest(`/accounts/products/${id}/`);

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
          `/accounts/media/?product_id=${productId}`
        );
        if (response && response?.data) {
          dispatch.products.setProductMedia(response?.data?.results);
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(error?.message);
      }
    },
  }),
});
