import React from 'react';
import Layout from 'src/lib/components/Layout';
import { getProductsByCollection } from 'src/lib/state/shopify/services';
import { Products } from 'src/lib/state/shopify/queries';
import { getSiteSchema, useSiteSchema } from 'src/lib/seo';
import { GetStaticPropsContext } from 'next';
import { getNextStaticProps } from '@wpengine/headless/next';
import { getApolloClient } from '@wpengine/headless';
import { gql, useQuery } from '@apollo/client';

const featuredPostsQuery = gql`
  query {
    posts(where: { categoryName: "featured" }) {
      nodes {
        title
        excerpt
        slug
        tags(where: { search: "collection-" }) {
          nodes {
            name
          }
        }
      }
    }
  }
`;

interface HomeProps {
  postProducts: Record<string, Products>;
}

function Home({ postProducts }: HomeProps) {
  return (
    <Layout>
      <h1>Home</h1>
    </Layout>
  );
}

export default Home;
