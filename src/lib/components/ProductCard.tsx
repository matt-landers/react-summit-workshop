import { actions } from 'src/lib/state/shopify/actor';
import Link from 'next/link';
import React from 'react';
import { Product } from '../state/shopify/queries';

export const ProductCard: React.FC<{
  product: Product;
  className?: string;
}> = ({ product, className }) => {
  return (
    <div className={`card ${className}`}>
      <img
        src={product.images[0].src}
        alt={product.title}
        className="card-img-top"
      />
      <div className="card-body">
        <h5 className="card-title">{product.title}</h5>
        <button
          className="btn btn-primary me-3"
          onClick={() => {
            void actions.addProduct(product.variants[0].id);
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
