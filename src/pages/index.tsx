import React from 'react';
import Layout from 'src/lib/components/Layout';
import { ProductCard } from 'src/lib/components/ProductCard';
import { allProducts } from 'src/lib/state/shopify/services';
import { Products } from 'src/lib/state/shopify/queries';
import { getSiteSchema, useSiteSchema } from 'src/lib/seo';
import { GetStaticPropsContext } from 'next';
import { getNextStaticProps } from '@wpengine/headless/next';
import { getApolloClient } from '@wpengine/headless';

interface HomeProps {
  products: Products;
}

function Home({ products }: HomeProps) {
  const siteSchema = useSiteSchema();

  return (
    <Layout seo={siteSchema}>
      <div className="row py-5">
        {(products?.edges.length ?? 0) > 0 &&
          products?.edges.map((product) => (
            <div key={product.node.id} className="col-md-4">
              <ProductCard product={product.node} />
            </div>
          ))}
      </div>
    </Layout>
  );
}

export default Home;

export async function getStaticProps(ctx: GetStaticPropsContext) {
  const products = await allProducts();
  const client = getApolloClient();
  await getSiteSchema(client);
  const result = await getNextStaticProps(ctx);
  result.props.products = products;

  return result;
}
