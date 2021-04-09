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
import PostCard from 'src/lib/components/PostCard';

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
  const featuredPosts = useQuery<WPGraphQL.GetPostsQuery>(featuredPostsQuery);

  return (
    <Layout seo={siteSchema}>
      <div className="row py-5">
        {featuredPosts.data?.posts.nodes.map((post) => (
          <React.Fragment key={post.slug}>
            <div className="col-md-12 py-5">
              <PostCard post={post} />
              <div className="row">
                {postProducts[post.slug]?.edges.map((product) => (
                  <div key={product.node.id} className="col-md-4">
                    <ProductCard product={product.node} />
                  </div>
                ))}
              </div>
            </div>
            <hr />
          </React.Fragment>
        ))}
      </div>
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
