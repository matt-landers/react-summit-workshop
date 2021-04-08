import React from 'react';
import Layout from 'src/lib/components/Layout';
import { ProductCard } from 'src/lib/components/ProductCard';
import { useProducts } from 'src/lib/state/shopify/actor';

function Home() {
  const products = useProducts();
  console.log(products);
  return (
    <Layout>
      <div className="row py-5">
        {products?.edges?.length > 0 &&
          products.edges.nodes.map((product) => (
            <div key={product.id} className="col-md-4">
              <ProductCard product={product} />
            </div>
          ))}
      </div>
    </Layout>
  );
}

export default Home;
