import { Cart } from 'shopify-buy';
import service, { Products, Product } from './services';

import tates from 'tates';
import { createStateHook } from 'react-tates';

export interface ShopifyState {
  product: Product;
  products: Products;
  cart: Cart;
}

const tate = tates<ShopifyState>();
const { state } = tate;

export const actions = {
  async getProducts() {
    state.products = await service.allProducts();
  },
  async getProduct(handle: string) {
    state.product = await service.getProduct(handle);
  },
  async getCart() {
    state.cart = await service.getCheckout();
  },
  async addProduct(variantId: string): Promise<void> {
    await service.addProduct(variantId);
    actions.getCart();
  },
};

export const useProduct = createStateHook<
  Product,
  typeof tate,
  typeof actions.getProduct
>({
  tate,
  action: actions.getProduct,
  property: 'product',
});

export const useProducts = createStateHook<
  Products,
  typeof tate,
  typeof actions.getProducts
>({
  tate,
  action: actions.getProducts,
  property: 'products',
});

export const useCart = createStateHook<
  Cart,
  typeof tate,
  typeof actions.getCart
>({
  tate,
  action: actions.getCart,
  property: 'cart',
});
