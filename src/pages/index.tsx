import React from 'react';
import Layout from 'src/lib/components/Layout';
import { ProductCard } from 'src/lib/components/ProductCard';
import { getProductsByCollection } from 'src/lib/state/shopify/services';
import { Products } from 'src/lib/state/shopify/queries';
import { getSiteSchema, useSiteSchema } from 'src/lib/seo';
import { GetStaticPropsContext } from 'next';
import { getNextStaticProps } from '@wpengine/headless/next';
import { getApolloClient } from '@wpengine/headless';
import { gql, useQuery } from '@apollo/client';
import PostHeader from 'src/lib/components/PostHeader';

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
  const siteSchema = useSiteSchema();
  const { data } = useQuery<WPGraphQL.GetPostsQuery>(featuredPostsQuery);

  const posts = data?.posts?.nodes ?? [];

  return (
    <Layout seo={siteSchema}>
      {posts.map((post) => (
        <div className="row my-4" key={post.slug}>
          <div className="col-md-12">
            <PostHeader post={post} />
          </div>
          {postProducts[post.slug]?.map((product) => (
            <div key={product.id} className="col-md-4">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ))}
    </Layout>
  );
}

export default Home;

export async function getStaticProps(ctx: GetStaticPropsContext) {
  const client = getApolloClient(ctx);
  await getSiteSchema(client);
  const featuredPosts = await client.query<{
    posts: WPGraphQL.RootQuery['posts'];
  }>({
    query: featuredPostsQuery,
  });

  const postProducts: Record<string, Products> = {};

  if (featuredPosts.data.posts?.nodes) {
    await Promise.all(
      featuredPosts.data.posts.nodes.map(async (post) => {
        if (post.tags?.nodes && post.tags.nodes.length > 0) {
          const tag: string = post.tags.nodes.map(
            (postTag) => postTag.name,
          )[0] as string;
          const products = await getProductsByCollection(
            tag.replace('collection-', ''),
          );

          postProducts[post.slug as string] = products;
        }
      }),
    );
  }

  const result = await getNextStaticProps(ctx);
  result.props.postProducts = postProducts;

  return result;
}
