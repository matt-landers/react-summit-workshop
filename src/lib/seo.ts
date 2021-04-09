import {
  gql,
  ApolloQueryResult,
  QueryResult,
  useQuery,
  ApolloClient,
} from '@apollo/client';
import { SeoProps } from 'react-headless-yoast';

export const seoQuery = gql`
  {
    seo {
      schema {
        companyName
        companyLogo {
          altText
          sourceUrl
          srcSet
        }
        inLanguage
        siteName
        siteUrl
      }
    }
  }
`;

function processResult(
  result:
    | ApolloQueryResult<{ seo?: { schema?: SeoProps['siteSchema'] } }>
    | QueryResult<{ seo?: { schema?: SeoProps['siteSchema'] } }>,
) {
  const siteSchema = result.data?.seo?.schema && { ...result.data.seo.schema };
  let schema: Pick<SeoProps, 'siteSchema'> | undefined;

  if (siteSchema) {
    schema = {
      siteSchema,
    };
  }

  return schema;
}

export function useSiteSchema() {
  return processResult(
    useQuery<{ seo?: { schema?: SeoProps['siteSchema'] } }>(seoQuery),
  );
}

export async function getSiteSchema(client: ApolloClient<any>) {
  return processResult(
    await client.query<{ seo?: { schema?: SeoProps['siteSchema'] } }>({
      query: seoQuery,
    }),
  );
}
