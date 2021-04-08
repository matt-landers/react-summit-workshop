import Layout from 'src/lib/components/Layout';
import React from 'react';
import { useCheckout } from 'src/lib/state/shopify/actor';
import { CheckoutLineItemCard } from 'src/lib/components/CheckoutLineItemCard';

const CartPage: React.FC = () => {
  const checkout = useCheckout();

  return (
    <Layout>
      <div className="row py-5">
        {checkout?.lineItems.edges.map((item) => (
          <div key={item.node.id} className="col-md-4">
            <CheckoutLineItemCard key={item.node.id} item={item.node} />
          </div>
        ))}
      </div>
      <div className="row">
        <a
          href={((checkout as any) as { webUrl: string })?.webUrl}
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
