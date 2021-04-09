import { gql, useQuery } from '@apollo/client';
import Layout from 'src/lib/components/Layout';
import { useRouter } from 'next/router';
import React from 'react';
import { Products } from 'src/lib/state/shopify/queries';
import { getProductsByCollection } from 'src/lib/state/shopify/services';
import { getApolloClient } from '@wpengine/headless';
import { getNextStaticProps } from '@wpengine/headless/next';
import { GetStaticPropsContext } from 'next';
import { getSiteSchema, useSiteSchema } from 'src/lib/seo';
import { PageSeo } from 'react-headless-yoast';

const GET_POST = gql`
  query GetPost($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      featuredImage {
        node {
          uri
        }
      }
      title
      content
      tags(where: { search: "collection-" }) {
        nodes {
          name
        }
      }
      seo {
        breadcrumbs {
          text
          url
        }
        schema {
          articleType
          pageType
          raw
        }
        canonical
        cornerstone
        focuskw
        metaDesc
        metaKeywords
        metaRobotsNofollow
        metaRobotsNoindex
        opengraphAuthor
        opengraphDescription
        opengraphImage {
          altText
          srcSet
          sourceUrl
        }
        opengraphModifiedTime
        opengraphPublishedTime
        opengraphPublisher
        opengraphSiteName
        opengraphTitle
        opengraphType
        opengraphUrl
        readingTime
        title
        twitterDescription
        twitterImage {
          altText
          srcSet
          sourceUrl
        }
        twitterTitle
      }
    }
  }
`;

interface PostPageProps {
  products: Products;
}

const PostPage = ({ products }: PostPageProps) => {
  return (
    <Layout>
      <h1>Single Post</h1>
    </Layout>
  );
};

export default PostPage;
