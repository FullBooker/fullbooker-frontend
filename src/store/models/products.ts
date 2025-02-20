import type { RootModel } from ".";
import { createModel } from "@rematch/core";
import { ProductsFilters } from "@/domain/dto/input";
import { buildQueryString, getRequest } from "@/utilities";
import { CartItem, CartSummary, Product, ProductMedia } from "@/domain/product";

type ProductsState = {
  products: Array<Product>;
  product: Product | null;
  productMedia: Array<ProductMedia>;
  cart: Array<CartItem>;
  cartSummary: CartSummary | null;
};

export const products = createModel<RootModel>()({
  state: {
    products: [],
    product: null,
    productMedia: [],
    cart: [],
    cartSummary: null,
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
    setProductDetailsToCart(state: ProductsState, cartSummary: CartSummary) {
      return {
        ...state,
        cart: [],
        cartSummary,
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
