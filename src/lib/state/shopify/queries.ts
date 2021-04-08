import { gql } from '@apollo/client';

export const ALL_PRODUCTS = gql`
  {
    products(first: 10) {
      edges {
        node {
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
      }
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($handle: String!) {
    productByHandle(handle: $handle) {
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
  }
`;

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
