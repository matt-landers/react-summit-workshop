import Layout from 'lib/components/Layout';
import React, { useEffect, useState } from 'react';
import shopify, { Product, Products } from '../lib/shopify';
import Link from 'next/link';
import { ProductCard } from 'lib/components/ProductCard';

function Home() {
  const [products, setProducts] = useState<Products>([]);

  useEffect(() => {
    async function all() {
      setProducts(await shopify.allProducts());
    }
    all();
  }, []);

  return (
    <Layout>
      <div className="row py-5">
        {products.map((product) => (
          <div key={product.id} className="col-md-4">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </Layout>
  );
}

export default Home;
