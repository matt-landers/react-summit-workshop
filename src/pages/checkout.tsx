import Layout from 'src/lib/components/Layout';
import React from 'react';
import { useCheckout } from 'src/lib/state/shopify/actor';

const CartPage: React.FC = () => {
  return (
    <Layout>
      <h1>Cart</h1>
    </Layout>
  );
};

export default CartPage;
