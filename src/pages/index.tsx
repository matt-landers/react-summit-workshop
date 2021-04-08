import React from 'react';
import Layout from 'src/lib/components/Layout';
import { ProductCard } from 'src/lib/components/ProductCard';
import { allProducts } from 'src/lib/state/shopify/services';
import { Products } from 'src/lib/state/shopify/queries';

interface HomeProps {
  products: Products;
}

function Home({ products }: HomeProps) {
  return (
    <Layout>
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

export async function getStaticProps() {
  const products = await allProducts();

  return {
    props: {
      products,
    },
  };
}
