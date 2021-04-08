import { gql, useQuery } from '@apollo/client';
import Layout from 'src/lib/components/Layout';
import { ProductCard } from 'src/lib/components/ProductCard';
import { useRouter } from 'next/router';
import React from 'react';
import { Products } from 'src/lib/state/shopify/queries';
import {
  allProducts,
  getProductsByCollection,
} from 'src/lib/state/shopify/services';
import { getApolloClient } from '@wpengine/headless';
import { GetStaticPropsContext } from 'next';

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
    }
  }
`;

interface PostPageProps {
  products: Products;
}

const PostPage = ({ products }: PostPageProps) => {
  const router = useRouter();
  const { slug } = router.query;
  const { data } = useQuery<{ post: WPGraphQL.RootQuery['post'] }>(GET_POST, {
    variables: {
      slug,
    },
  });

  const post = data?.post;

  return (
    <Layout>
      <div className="row">
        <div className="col-md-9">
          <article>
            <h1>{post?.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: post?.content ?? '' }} />
          </article>
        </div>
        <div className="col-md-3">
          {products?.edges.map((product) => (
            <ProductCard key={product.node.id} product={product.node} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default PostPage;

export function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const slug = context?.params?.slug as string;
  const client = getApolloClient(context);

  const { data } = await client.query({
    query: GET_POST,
    variables: {
      slug,
    },
  });

  let products: Products = { edges: [] };

  if (data.post.tags.nodes.length > 0) {
    const tag: string = data.post.tags.nodes.map(
      (tag: { name: string }) => tag.name,
    )[0];
    products = await getProductsByCollection(tag.replace('collection-', ''));
  }

  return {
    props: {
      products,
    },
  };
}
