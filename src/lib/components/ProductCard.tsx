import { actions } from 'src/lib/state/shopify/actor';
import { Product } from 'src/lib/state/shopify/services';
import Link from 'next/link';
import React from 'react';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <div className="card">
      <img src={product.images[0].src} alt="" className="card-img-top" />
      <div className="card-body">
        <h5 className="card-title">{product.title}</h5>
        <button
          className="btn btn-primary me-3"
          onClick={() => {
            actions.addProduct(product.variants[0].id as string);
          }}>
          Add to Cart
        </button>
        <Link href={`/products/${product.handle}`}>
          <a href={`/products/${product.handle}`} className="btn btn-secondary">
            View Details
          </a>
        </Link>
      </div>
    </div>
  );
};
