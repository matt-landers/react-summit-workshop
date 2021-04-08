import { gql } from '@apollo/client';

export interface Connection<T> {
  edges: {
    nodes: T[];
  };
}

export interface ProductImage {
  src: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  images: Connection<ProductImage>;
  variants: Connection<ProductVariant>;
  handle: string;
}

export interface ProductVariant {
  id: string;
  image?: ProductImage;
  product?: Pick<Product, 'handle'>;
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

export interface Products extends Connection<Product> {}

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
          handle
        }
      }
    }
  }
`;

export const ALL_PRODUCTS = gql`
  ${PRODUCT_DATA}
  {
    products(first: 10) {
      edges {
        node {
          ...productData
        }
      }
    }
  }
`;

export interface AllProducts {
  products: Products;
}

export const GET_PRODUCT = gql`
  ${PRODUCT_DATA}
  query GetProduct($handle: String!) {
    productByHandle(handle: $handle) {
      ...productData
    }
  }
`;

export interface GetProduct {
  productByHandle: Product;
}

const CREATE_CHECKOUT = gql`
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

export interface CheckoutLineItem {
  id: string;
  title: string;
  quantity: number;
  variant: ProductVariant;
}

export interface Checkout {
  id: string;
  webUrl: string;
  lineItems: Connection<CheckoutLineItem>;
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
  node: Checkout;
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
