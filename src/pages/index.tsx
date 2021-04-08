import React from 'react';
import Layout from 'src/lib/components/Layout';
import { ProductCard } from 'src/lib/components/ProductCard';
import { useProducts } from 'src/lib/state/shopify/actor';

function Home() {
  const products = useProducts();

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
