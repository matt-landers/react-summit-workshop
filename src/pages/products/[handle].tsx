import Layout from 'src/lib/components/Layout';
import { useRouter } from 'next/router';
import React from 'react';
import { useQuery, gql } from '@apollo/client';
import PostCard from 'src/lib/components/PostCard';
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
  const siteSchema = useSiteSchema();
  const { data } = useQuery<WPGraphQL.GetPostsQuery>(productPostsQuery, {
    variables: {
      tag: `collection-${product.collections.edges[0].node.handle}`,
    },
  });

  return (
    <Layout
      seo={{
        page: {
          title: product?.title,
          seo: {
            metaDesc: product?.description,
          },
        },
        siteSchema: siteSchema?.siteSchema,
      }}>
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
                  void actions.addProduct(product?.variants.edges[0].node.id);
                }}>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          {data?.posts.nodes?.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ProductPage;

export function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export async function getStaticProps(ctx: GetStaticPropsContext) {
  const product = await getProduct(ctx.params?.handle as string);
  const client = getApolloClient(ctx);
  await getSiteSchema(client);
  await client.query({
    query: productPostsQuery,
    variables: {
      tag: `collection-${product.collections.edges[0].node.handle}`,
    },
  });
  const result = await getNextStaticProps(ctx);
  result.props.product = product;

  return result;
}
