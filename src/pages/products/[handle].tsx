import Layout from 'src/lib/components/Layout';
import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { actions } from 'src/lib/state/shopify/actor';
import { getProduct } from 'src/lib/state/shopify/services';
import { getNextStaticProps } from '@wpengine/headless/next';
import { GetStaticPropsContext } from 'next';
import { getSiteSchema, useSiteSchema } from 'src/lib/seo';
import { Product } from 'src/lib/state/shopify/queries';
import { getApolloClient } from '@wpengine/headless';

const productPostsQuery = gql`
  query GetProductPosts($tag: String!) {
    posts(where: { tag: $tag }) {
      nodes {
        title
        excerpt
        slug
      }
    }
  }
`;

interface ProductPageProps {
  product: Product;
}

const ProductPage: React.FC<ProductPageProps> = ({ product }) => {
  return (
    <Layout>
      <h1>Product</h1>
    </Layout>
  );
};

export default ProductPage;
