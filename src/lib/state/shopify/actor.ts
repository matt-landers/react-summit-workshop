import tates from 'tates';
import { createStateHook } from 'react-tates';
import service from './services';
import { Checkout, Product, Products } from './queries';

export interface ShopifyState {
  product: Product;
  products: Products;
  checkout: Checkout;
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
  async getCheckout() {
    state.checkout = await service.getCheckout();
  },
  async addProduct(variantId: string): Promise<void> {
    await service.addProduct(variantId);
    void actions.getCheckout();
  },
  async removeProduct(variantId: string): Promise<void> {
    await service.removeProduct(variantId);
    void actions.getCheckout();
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

export const useCheckout = createStateHook<
  Checkout,
  typeof tate,
  typeof actions.getCheckout
>({
  tate,
  action: actions.getCheckout,
  property: 'cart',
});
