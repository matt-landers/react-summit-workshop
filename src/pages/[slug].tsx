import { gql, useQuery } from '@apollo/client';
import Layout from 'src/lib/components/Layout';
import { ProductCard } from 'src/lib/components/ProductCard';
import { useRouter } from 'next/router';
import React from 'react';
import { Products } from 'src/lib/state/shopify/queries';
import { allProducts } from 'src/lib/state/shopify/services';

interface PostPageProps {
  products: Products;
}

const PostPage = ({ products }: PostPageProps) => {
  const router = useRouter();
  const { slug } = router.query;
  const { data } = useQuery<{ post: WPGraphQL.RootQuery['post'] }>(
    gql`
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
    `,
    {
      variables: {
        slug,
      },
    },
  );

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

export async function getStaticProps() {
  const products = await allProducts();

  return {
    props: {
      products,
    },
  };
}
