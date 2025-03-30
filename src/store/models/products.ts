import type { RootModel } from ".";
import { createModel } from "@rematch/core";
import { ProductsFilters } from "@/domain/dto/input";
import { buildQueryString, getRequest } from "@/utilities";
import { CartItem, CartSummary, Product, ProductMedia } from "@/domain/product";
import { ComprehensiveProductFilters } from "@/domain/dto/product.input";
import { County } from "@/domain/location";
import { ProductsAPIResponse } from "@/domain/dto/output";

type ProductsState = {
  products: ProductsAPIResponse;
  product: Product | null;
  popularProducts: Array<Product>;
  nearByProducts: Array<Product>;
  recommendedProducts: Array<Product>;
  upcomingProducts: Array<Product>;
  productMedia: Array<ProductMedia>;
  cart: Array<CartItem>;
  cartSummary: CartSummary | null;
  comprehensiveProductFilters: ComprehensiveProductFilters | null;
  searchHistory: Array<string>;
};

export const products = createModel<RootModel>()({
  state: {
    products: {
      count: 0,
      results: [],
    },
    product: null,
    popularProducts: [],
    nearByProducts: [],
    recommendedProducts: [],
    upcomingProducts: [],
    productMedia: [],
    cart: [],
    cartSummary: null,
    comprehensiveProductFilters: {
      search: "",
      tag: null,
      locations: [],
      categoies: [],
      start_date: "",
      end_date: "",
      max_price: "0",
      min_price: "0",
    },
    searchHistory: ["1234"],
  } as ProductsState,
  reducers: {
    setProductDetails(state: ProductsState, product: Product | null) {
      return {
        ...state,
        product,
      };
    },
    setProducts(state: ProductsState, products: ProductsAPIResponse) {
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
        total_price: updatedCart.reduce((sum, item) => sum + item.cost, 0),
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
        total_price: updatedCart.reduce((sum, item) => sum + item.cost, 0),
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
          prefill_all_items_with_primary_user_details: true,
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
        state.comprehensiveProductFilters?.categories || [];
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
    toggleTagFilter(state: ProductsState, tag: string): ProductsState {
      return {
        ...state,
        comprehensiveProductFilters: {
          ...state.comprehensiveProductFilters,
          tag: state?.comprehensiveProductFilters?.tag === tag ? null : tag,
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
          search: "",
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
    addSearchKeyword(state: ProductsState, search: string) {
      const updatedHistory = !state?.searchHistory?.length
        ? [search]
        : [
            search,
            ...state?.searchHistory?.filter((k) => k !== search),
          ].slice(0, 10);
      return {
        ...state,
        searchHistory: updatedHistory,
      };
    },

    removeSearchKeyword(state: ProductsState, search: string) {
      return {
        ...state,
        searchHistory: state?.searchHistory?.filter((k) => k !== search),
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
          dispatch.products.setProducts(response?.data);
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
        dispatch.products.setProductDetails(null);
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
