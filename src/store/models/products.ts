import type { RootModel } from ".";
import { createModel } from "@rematch/core";
import { ProductsFilters } from "@/domain/dto/input";
import { buildQueryString, getRequest } from "@/utilities";
import { CartItem, CartSummary, ComprehensiveProductFilters, Product, ProductMedia } from "@/domain/product";

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
  productFilters: ComprehensiveProductFilters | null;
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
    productFilters: null,
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

      if (existingItem) {
        updatedCart = state.cart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      } else {
        updatedCart = [...state.cart, item];
      }
      return {
        ...state,
        cart: [...state.cart, item],
        cartSummary: {
          ...state.cartSummary,
          total_items: updatedCart?.reduce(
            (sum: number, cartItem: CartItem) => sum + cartItem.quantity,
            0
          ),
          total_price: updatedCart?.reduce(
            (sum: number, cartItem: CartItem) =>
              sum + cartItem.total * cartItem.quantity,
            0
          ),
        } as CartSummary,
      };
    },
    removeFromCart(state: ProductsState, id: string) {
      const updatedCart = state.cart.filter((item: CartItem) => item.id !== id);
      return {
        ...state,
        cart: updatedCart,
        cartSummary: {
          ...state.cartSummary,
          total_items: updatedCart?.reduce(
            (sum: number, cartItem: CartItem) => sum + cartItem.quantity,
            0
          ),
          total_price: updatedCart?.reduce(
            (sum: number, cartItem: CartItem) =>
              sum + cartItem.total * cartItem.quantity,
            0
          ),
        } as CartSummary,
      };
    },
    clearCart(state: ProductsState) {
      return {
        ...state,
        cart: [],
        cartSummary: {
          ...state.cartSummary,
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
    setProductFilters(state: ProductsState, filters: ComprehensiveProductFilters) {
      return {
        ...state,
        productFilters: filters,
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
          payload ? `/accounts/products/?${buildQueryString(payload)}` : "/accounts/products/"
        );

        if (response && response?.data) {
          dispatch.products.setProducts(response?.data?.results);
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(error?.message);
      }
    },
    async getPopularProducts(payload: ProductsFilters, rootState) {
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
    async getRecommendedProducts(payload: ProductsFilters, rootState) {
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
    async getNearByProducts(payload: ProductsFilters, rootState) {
      try {
        const response: any = await getRequest(
          payload
            ? `/accounts/products/nearby?${buildQueryString(payload)}&lat=1.2921&long=36.8219`
            : "/accounts/products/nearby"
        );

        if (response && response?.data) {
          dispatch.products.setNearByProducts(response?.data?.results);
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(error?.message);
      }
    },
    async getUpcomingProducts(payload: ProductsFilters, rootState) {
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
