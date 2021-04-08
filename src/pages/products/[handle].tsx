import Layout from 'src/lib/components/Layout';
import { useRouter } from 'next/router';
import React from 'react';
import { useQuery, gql } from '@apollo/client';
import PostCard from 'src/lib/components/PostCard';
import { actions, useProduct } from 'src/lib/state/shopify/actor';

const ProductPage: React.FC = () => {
  const router = useRouter();
  const { handle } = router.query;
  const product = useProduct({ actionArgs: [handle as string] });

  const { data } = useQuery<{
    productposts: { nodes: { data: { posts: string } }[] };
  }>(
    gql`
      query GetProductPosts($title: String!) {
        productposts(where: { title: $title }) {
          nodes {
            data: acfProductLinkGroup {
              posts
            }
          }
        }
      }
    `,
    {
      variables: {
        title: handle,
      },
    },
  );

  return (
    <Layout>
      <div className="row py-5">
        <div className="col-md-6">
          <div className="card">
            <img
              style={{ maxWidth: '300px' }}
              src={product?.images[0].src}
              alt=""
              className="card-img-top"
            />
            <div className="card-body">
              <h5 className="card-title">{product?.title}</h5>
              <button
                type="button"
                className="btn btn-primary me-3"
                onClick={() => {
                  void actions.addProduct(product?.variants[0].id as string);
                }}>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          {data?.productposts?.nodes[0]?.data?.posts
            ?.split(',')
            .map((slug: string) => (
              <PostCard key={slug} slug={slug} />
            ))}
        </div>
      </div>
    </Layout>
  );
};

export default ProductPage;
