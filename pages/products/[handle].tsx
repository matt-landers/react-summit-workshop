import Layout from 'lib/components/Layout';
import shopify, { Product } from 'lib/shopify';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import PostCard from 'lib/components/PostCard';

const ProductPage: React.FC = () => {
  const [product, setProduct] = useState<Product>();
  const router = useRouter();
  const { handle } = router.query;

  const { data } = useQuery(
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

  useEffect(() => {
    async function getProduct() {
      setProduct(await shopify.getProduct(handle as any));
    }
    if (handle) {
      getProduct();
    }
  }, [handle]);

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
                className="btn btn-primary me-3"
                onClick={() => {
                  shopify.addProduct(product?.variants[0].id as string);
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
