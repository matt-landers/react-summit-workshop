import { actions } from 'src/lib/state/shopify/actor';
import Link from 'next/link';
import React from 'react';
import { Product } from '../state/shopify/queries';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <div className="card">
      <img src={product.images.edges[0].node.src} alt="" className="card-img-top" />
      <div className="card-body">
        <h5 className="card-title">{product.title}</h5>
        <button
          type="button"
          className="btn btn-primary me-3"
          onClick={() => {
            void actions.addProduct(product.variants.edges[0].node.id as string);
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
