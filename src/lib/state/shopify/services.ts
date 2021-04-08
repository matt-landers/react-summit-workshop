import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import {
  AddLineItemVariables,
  ADD_LINE_ITEM,
  AllProducts,
  ALL_PRODUCTS,
  Checkout,
  CreateCheckout,
  CREATE_CHECKOUT,
  GetCheckout,
  GetProduct,
  GetProductsByCollection,
  GET_CHECKOUT,
  GET_PRODUCT,
  GET_PRODUCTS_BY_COLLECTION,
  Product,
  Products,
  RemoveLineItemVariables,
  REMOVE_LINE_ITEM,
} from './queries';

const client = new ApolloClient({
  uri: 'https://devrel.myshopify.com/api/2021-04/graphql.json',
  cache: new InMemoryCache(),
  headers: {
    'X-Shopify-Storefront-Access-Token': 'b93aba823553b27aee2c51744caf0cf1',
  },
});

async function allProducts(): Promise<Products> {
  const { data } = await client.query<AllProducts>({
    query: ALL_PRODUCTS,
  });
  return data.products;
}

async function getCheckoutId(): Promise<string> {
  if (localStorage.getItem('checkoutId')) {
    return localStorage.getItem('checkoutId') ?? '';
  }
  const { data } = await client.mutate<CreateCheckout>({
    mutation: CREATE_CHECKOUT,
  });
  localStorage.setItem(
    'checkoutId',
    data?.checkoutCreate.checkout.id as string,
  );
  return data?.checkoutCreate.checkout.id as string;
}

async function addProduct(variantId: string): Promise<void> {
  await client.mutate<any, AddLineItemVariables>({
    mutation: ADD_LINE_ITEM,
    variables: {
      checkoutId: await getCheckoutId(),
      lineItems: [{ quantity: 1, variantId }],
    },
  });
}

async function removeProduct(variantId: string) {
  await client.mutate<any, RemoveLineItemVariables>({
    mutation: REMOVE_LINE_ITEM,
    variables: {
      checkoutId: await getCheckoutId(),
      lineItemIds: [variantId],
    },
  });
}

async function getCheckout(): Promise<Checkout> {
  const { data } = await client.query<GetCheckout>({
    query: GET_CHECKOUT,
    variables: {
      id: await getCheckoutId(),
    },
  });
  return data.node;
}

async function getProduct(handle: string): Promise<Product> {
  const { data } = await client.query<GetProduct>({
    query: GET_PRODUCT,
    variables: {
      handle,
    },
  });
  return data.productByHandle;
}

async function getProductsByCollection(handle: string): Promise<Products> {
  const { data } = await client.query<GetProductsByCollection>({
    query: GET_PRODUCTS_BY_COLLECTION,
    variables: {
      handle,
    },
  });

  return data.collectionByHandle.products;
}

export default {
  allProducts,
  addProduct,
  removeProduct,
  getCheckout,
  getProduct,
  getProductsByCollection,
};
