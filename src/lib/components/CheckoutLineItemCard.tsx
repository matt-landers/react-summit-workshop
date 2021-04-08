import { actions } from 'src/lib/state/shopify/actor';
import Link from 'next/link';
import React from 'react';
import { CheckoutLineItem } from '../state/shopify/queries';

export const CheckoutLineItemCard: React.FC<{ item: CheckoutLineItem }> = ({
  item,
}) => {
  return (
    <div className="card">
      <img
        src={(item as any).variant.image.src as string}
        alt=""
        className="card-img-top"
      />
      <div className="card-body">
        <h5 className="card-title">{item.title}</h5>
        <p>
          Quantity:
          {item.quantity}
        </p>
        <button
          type="button"
          className="btn btn-primary me-3"
          onClick={() => {
            void actions.removeProduct(item.id as string);
          }}>
          Remove from Cart
        </button>
        <Link
          href={`/products/${item.variant.product.handle as string}`}>
          <a
            href={`/products/${item.variant.product.handle as string}`}
            className="btn btn-secondary">
            View Details
          </a>
        </Link>
      </div>
    </div>
  );
};
