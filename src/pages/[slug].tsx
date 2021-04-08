import { gql, useQuery } from '@apollo/client';
import Layout from 'src/lib/components/Layout';
import { ProductCard } from 'src/lib/components/ProductCard';
import { useRouter } from 'next/router';
import React from 'react';
import { useProducts } from 'src/lib/state/shopify/actor';

const PostPage = () => {
  const products = useProducts();
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
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default PostPage;
