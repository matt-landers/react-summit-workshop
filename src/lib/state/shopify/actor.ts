import tates from 'tates';
import { createStateHook } from 'react-tates';
import * as service from './services';
import { Checkout } from './queries';

export interface ShopifyState {
  checkout: Checkout;
}

const tate = tates<ShopifyState>();
const { state } = tate;

export const actions = {
  async getCheckout() {
    const checkout = await service.getCheckout();

    if (!checkout) {
      return;
    }

    state.checkout = checkout;
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

export const useCheckout = createStateHook<
  Checkout,
  typeof tate,
  typeof actions.getCheckout
>({
  tate,
  action: actions.getCheckout,
  property: 'checkout',
});
