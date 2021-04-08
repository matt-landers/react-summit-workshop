import Layout from 'src/lib/components/Layout';
import React from 'react';
import { useCheckout } from 'src/lib/state/shopify/actor';
import { CheckoutLineItemCard } from 'src/lib/components/CheckoutLineItemCard';

const CartPage: React.FC = () => {
  const checkout = useCheckout();
  const hasItems = (checkout?.lineItems?.edges?.length as number) > 0;
  return (
    <Layout>
      {checkout && !hasItems && (
        <div className="row pt-5">
          <div className="col">
            <h1>No items in cart</h1>
          </div>
        </div>
      )}
      <div className="row py-5">
        {checkout?.lineItems.edges.map((item) => (
          <div key={item.node.id} className="col-md-4">
            <CheckoutLineItemCard key={item.node.id} item={item.node} />
          </div>
        ))}
      </div>
      <div className="row" style={{ display: hasItems ? '' : 'none' }}>
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
