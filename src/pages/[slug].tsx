import { gql, useQuery } from '@apollo/client';
import Layout from 'src/lib/components/Layout';
import { ProductCard } from 'src/lib/components/ProductCard';
import { useRouter } from 'next/router';
import React from 'react';
import { Products } from 'src/lib/state/shopify/queries';
import { getProductsByCollection } from 'src/lib/state/shopify/services';
import { getApolloClient } from '@wpengine/headless';
import { getNextStaticProps } from '@wpengine/headless/next';
import { GetStaticPropsContext } from 'next';
import { getSiteSchema, useSiteSchema } from 'src/lib/seo';
import { PageSeo } from 'react-headless-yoast';

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
      seo {
        breadcrumbs {
          text
          url
        }
        schema {
          articleType
          pageType
          raw
        }
        canonical
        cornerstone
        focuskw
        metaDesc
        metaKeywords
        metaRobotsNofollow
        metaRobotsNoindex
        opengraphAuthor
        opengraphDescription
        opengraphImage {
          altText
          srcSet
          sourceUrl
        }
        opengraphModifiedTime
        opengraphPublishedTime
        opengraphPublisher
        opengraphSiteName
        opengraphTitle
        opengraphType
        opengraphUrl
        readingTime
        title
        twitterDescription
        twitterImage {
          altText
          srcSet
          sourceUrl
        }
        twitterTitle
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
  const siteSchema = useSiteSchema();

  const post = data?.post;

  return (
    <Layout
      seo={{
        page: post as PageSeo,
        siteSchema: siteSchema?.siteSchema,
      }}>
      <div className="row mt-4">
        <div className="col-md-9">
          <article>
            <h1>{post?.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: post?.content ?? '' }} />
          </article>
        </div>
        <div className="col-md-3">
          {products?.map((product) => (
            <ProductCard className="mb-3" key={product.id} product={product} />
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
  await getSiteSchema(client);

  const { data } = await client.query<{ post: WPGraphQL.RootQuery['post'] }>({
    query: GET_POST,
    variables: {
      slug,
    },
  });

  if (!data?.post?.tags?.nodes) {
    return {
      notFound: true,
    };
  }

  let products: Products = [];

  if (data.post.tags.nodes.length > 0) {
    const tag: string = data.post.tags.nodes.map(
      (postTag) => postTag.name,
    )[0] as string;
    products = await getProductsByCollection(tag.replace('collection-', ''));
  }

  const result = await getNextStaticProps(context);
  result.props.products = products;

  return result;
}
