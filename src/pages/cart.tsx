import Layout from 'src/lib/components/Layout';
import React from 'react';
import { useCart } from 'src/lib/state/shopify/actor';
import { CartLineItemCard } from 'src/lib/components/CartItemCard';

const CartPage: React.FC = () => {
  const cart = useCart();

  return (
    <Layout>
      <div className="row py-5">
        {cart?.lineItems.map((item) => (
          <div key={item.id} className="col-md-4">
            <CartLineItemCard key={item.id} item={item} />
          </div>
        ))}
      </div>
      <div className="row">
        <a
          href={((cart as any) as { webUrl: string })?.webUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary">
          Checkout
        </a>
      </div>
    </Layout>
  );
};

export default CartPage;
