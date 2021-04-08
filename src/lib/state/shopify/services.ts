import { ApolloClient, InMemoryCache } from '@apollo/client';
import {
  AddLineItemVariables,
  ADD_LINE_ITEM,
  AllProducts,
  ALL_PRODUCTS,
  Checkout,
  CheckoutCreateInput,
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

const isServerSide = typeof window === 'undefined';

const client = new ApolloClient({
  ssrMode: isServerSide,
  uri: 'https://devrel.myshopify.com/api/2021-04/graphql.json',
  cache: new InMemoryCache(),
  headers: {
    'X-Shopify-Storefront-Access-Token': 'b93aba823553b27aee2c51744caf0cf1',
  },
});

export async function allProducts(): Promise<Products> {
  const { data } = await client.query<AllProducts>({
    query: ALL_PRODUCTS,
  });
  return data.products;
}

export async function getCheckoutId(): Promise<string> {
  if (isServerSide) {
    return '';
  }

  if (localStorage.getItem('checkoutId')) {
    return localStorage.getItem('checkoutId') ?? '';
  }

  const { data } = await client.mutate<CreateCheckout, CheckoutCreateInput>({
    mutation: CREATE_CHECKOUT,
    variables: {
      input: {},
    },
  });
  localStorage.setItem(
    'checkoutId',
    data?.checkoutCreate.checkout.id as string,
  );
  return data?.checkoutCreate.checkout.id as string;
}

export async function addProduct(variantId: string): Promise<void> {
  if (isServerSide) {
    return;
  }

  await client.mutate<any, AddLineItemVariables>({
    mutation: ADD_LINE_ITEM,
    variables: {
      checkoutId: await getCheckoutId(),
      lineItems: [{ quantity: 1, variantId }],
    },
  });
}

export async function removeProduct(variantId: string) {
  if (isServerSide) {
    return;
  }

  await client.mutate<any, RemoveLineItemVariables>({
    mutation: REMOVE_LINE_ITEM,
    variables: {
      checkoutId: await getCheckoutId(),
      lineItemIds: [variantId],
    },
  });
}

export async function getCheckout(): Promise<Checkout | null> {
  if (isServerSide) {
    return null;
  }

  const { data } = await client.query<GetCheckout>({
    query: GET_CHECKOUT,
    variables: {
      id: await getCheckoutId(),
    },
    fetchPolicy: 'no-cache',
  });
  return data.node;
}

export async function getProduct(handle: string): Promise<Product> {
  const { data } = await client.query<GetProduct>({
    query: GET_PRODUCT,
    variables: {
      handle,
    },
  });
  return data.productByHandle;
}

export async function getProductsByCollection(
  handle: string,
): Promise<Products> {
  const { data } = await client.query<GetProductsByCollection>({
    query: GET_PRODUCTS_BY_COLLECTION,
    variables: {
      handle,
    },
  });

  return data.collectionByHandle?.products || { edges: [] };
}
