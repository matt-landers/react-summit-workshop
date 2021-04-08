import Layout from 'src/lib/components/Layout';
import { useRouter } from 'next/router';
import React from 'react';
import { useQuery, gql } from '@apollo/client';
import PostCard from 'src/lib/components/PostCard';
import { actions } from 'src/lib/state/shopify/actor';
import { getProduct } from 'src/lib/state/shopify/services';
import { GetStaticPropsContext } from 'next';
import { Product } from 'src/lib/state/shopify/queries';

interface ProductPageProps {
  product: Product;
}

const ProductPage: React.FC<ProductPageProps> = ({ product }) => {
  const router = useRouter();
  const { handle } = router.query;
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
              src={product?.images.edges[0].node.src}
              alt=""
              className="card-img-top"
            />
            <div className="card-body">
              <h5 className="card-title">{product?.title}</h5>
              <button
                type="button"
                className="btn btn-primary me-3"
                onClick={() => {
                  void actions.addProduct(
                    product?.variants.edges[0].node.id as string,
                  );
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

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export async function getStaticProps(ctx: GetStaticPropsContext) {
  const product = await getProduct(ctx.params?.handle as string);

  return {
    props: {
      product,
    },
  };
}
