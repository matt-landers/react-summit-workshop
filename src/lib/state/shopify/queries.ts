import { gql } from '@apollo/client';

export interface Connection<T> {
  edges: {
    node: T;
  }[];
}

export interface ProductImage {
  src: string;
}

export interface ProductWithRelay {
  id: string;
  title: string;
  description: string;
  images: Connection<ProductImage>;
  variants: Connection<ProductVariant>;
  handle: string;
  collections: Connection<Collection>;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  images: ProductImage[];
  variants: ProductVariant[];
  handle: string;
  collections: Collection[];
}

export interface ProductVariant {
  id: string;
  image?: ProductImage;
  product: Pick<ProductWithRelay, 'handle'>;
}

export interface CheckoutInfo {
  checkout: {
    id: string;
  };
  checkoutUserErrors: {
    code: string;
    field: string;
    message: string;
  };
}

export type ProductsWithRelay = Connection<ProductWithRelay>;

export type Products = Product[];

export interface Collection {
  id: string;
  handle: string;
  title: string;
  description: string;
  products: ProductsWithRelay;
}

const PRODUCT_DATA = gql`
  fragment productData on Product {
    id
    description
    title
    handle
    images(first: 10) {
      edges {
        node {
          src: originalSrc
        }
      }
    }
    variants(first: 10) {
      edges {
        node {
          id
          price
        }
      }
    }
    collections(first: 10) {
      edges {
        node {
          id
          handle
          title
          description
        }
      }
    }
  }
`;

export const GET_PRODUCT = gql`
  ${PRODUCT_DATA}
  query GetProduct($handle: String!) {
    productByHandle(handle: $handle) {
      ...productData
    }
  }
`;

export interface GetProduct {
  productByHandle: ProductWithRelay;
}

export const CREATE_CHECKOUT = gql`
  mutation checkoutCreate($input: CheckoutCreateInput!) {
    checkoutCreate(input: $input) {
      checkout {
        id
      }
      checkoutUserErrors {
        code
        field
        message
      }
    }
  }
`;

export interface CreateCheckout {
  checkoutCreate: CheckoutInfo;
}

export interface CheckoutCreateInput {
  input: any;
}

export interface CheckoutLineItem {
  id: string;
  title: string;
  quantity: number;
  variant: ProductVariant;
}

export interface CheckoutWithRelay {
  id: string;
  webUrl: string;
  lineItems: Connection<CheckoutLineItem>;
}

export interface Checkout {
  id: string;
  webUrl: string;
  lineItems: CheckoutLineItem[];
}

export const GET_CHECKOUT = gql`
  query GetCheckout($id: ID!) {
    node(id: $id) {
      ... on Checkout {
        id
        webUrl
        lineItems(first: 100) {
          edges {
            node {
              id
              quantity
              title
              variant {
                id
                image {
                  src: originalSrc
                }
                product {
                  handle
                }
              }
            }
          }
        }
      }
    }
  }
`;

export interface GetCheckout {
  node: CheckoutWithRelay;
}

export const ADD_LINE_ITEM = gql`
  mutation checkoutLineItemsAdd(
    $lineItems: [CheckoutLineItemInput!]!
    $checkoutId: ID!
  ) {
    checkoutLineItemsAdd(lineItems: $lineItems, checkoutId: $checkoutId) {
      checkout {
        id
      }
      checkoutUserErrors {
        code
        field
        message
      }
    }
  }
`;

export type AddLineItemVariables = {
  checkoutId: string;
  lineItems: {
    quantity: number;
    variantId: string;
  }[];
};

export const REMOVE_LINE_ITEM = gql`
  mutation checkoutLineItemsRemove($checkoutId: ID!, $lineItemIds: [ID!]!) {
    checkoutLineItemsRemove(
      checkoutId: $checkoutId
      lineItemIds: $lineItemIds
    ) {
      checkout {
        id
      }
      checkoutUserErrors {
        code
        field
        message
      }
    }
  }
`;

export type RemoveLineItemVariables = {
  checkoutId: string;
  lineItemIds: string[];
};

export const GET_PRODUCTS_BY_COLLECTION = gql`
  ${PRODUCT_DATA}
  query GetProductsByCollection($handle: String!) {
    collectionByHandle(handle: $handle) {
      id
      handle
      title
      description
      products(first: 10) {
        edges {
          node {
            ...productData
          }
        }
      }
    }
  }
`;

export interface GetProductsByCollection {
  collectionByHandle?: Collection;
}
