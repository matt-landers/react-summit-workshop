import { gql, useQuery } from '@apollo/client';
import Layout from 'lib/components/Layout';
import { ProductCard } from 'lib/components/ProductCard';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import shopify, { Products } from '../lib/shopify';

const PostPage = () => {
  const [products, setProducts] = useState<Products>([]);
  const router = useRouter();
  const { slug } = router.query;
  const { data } = useQuery(
    gql`
      query GetPost($slug: String!) {
        postBy(slug: $slug) {
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

  const post = data?.postBy;

  useEffect(() => {
    async function getProducts() {
      const products = await shopify.getProductsByCollection(
        post?.tags?.nodes[0].name.replace('collection-', ''),
      );
      setProducts(products);
    }
    if (post) {
      getProducts();
    }
  }, [post]);

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
