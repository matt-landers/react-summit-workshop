import React, { useState } from 'react';
import { useContext } from 'react';
import Client from 'shopify-buy';
const client = Client.buildClient({
  domain: 'devrel.myshopify.com',
  storefrontAccessToken: 'b93aba823553b27aee2c51744caf0cf1',
});
export type Product = Pick<
  ShopifyBuy.Product,
  'id' | 'title' | 'description' | 'onlineStoreUrl' | 'images' | 'variants'
> & { handle: string };
export type Products = Product[];

function transformProduct(product: ShopifyBuy.Product) {
  return {
    id: product.id,
    images: product.images,
    title: product.title,
    description: product.description,
    onlineStoreUrl: product.onlineStoreUrl,
    variants: product.variants,
    handle: (product as any).handle as string,
  };
}

async function allProducts(): Promise<Products> {
  const products = await client.product.fetchAll();
  return products.map((product) => transformProduct(product));
}

async function getCheckoutId(): Promise<string> {
  if (localStorage.getItem('checkoutId')) {
    return localStorage.getItem('checkoutId') ?? '';
  } else {
    const checkout = await client.checkout.create();
    localStorage.setItem('checkoutId', checkout.id as string);
    return checkout.id as string;
  }
}

async function addProduct(variantId: string) {
  await client.checkout.addLineItems(await getCheckoutId(), [
    { variantId, quantity: 1 },
  ]);
  _setCartContext(await getCheckout());
}

async function getCheckout() {
  const checkout = await client.checkout.fetch(await getCheckoutId());
  console.log(checkout);
  return checkout;
}

let _setCartContext: React.Dispatch<React.SetStateAction<ShopifyBuy.Cart>>;
const _cartContext: ShopifyBuy.Cart = {} as any;
export const CartContext = React.createContext(_cartContext);

export const createCartContext = () => {
  const [cartContext, setCartContext] = useState(_cartContext);
  _setCartContext = setCartContext;
  return cartContext;
};

async function getProduct(handle: string) {
  const product = await client.product.fetchByHandle(handle);
  return transformProduct(product);
}

async function getProductsByCollection(handle: string) {
  const collection = await client.collection.fetchByHandle(handle);
  return (collection as any).products.map((product: ShopifyBuy.Product) =>
    transformProduct(product),
  );
}

export default {
  allProducts,
  addProduct,
  getCheckout,
  getProduct,
  getProductsByCollection,
};
