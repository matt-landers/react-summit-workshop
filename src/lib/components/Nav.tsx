import React from 'react';
import { useCheckout } from 'src/lib/state/shopify/actor';

const Nav: React.FC = () => {
  const checkout = useCheckout();
  const quantities = checkout?.lineItems?.edges.map(
    (item) => item.node.quantity,
  );

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <a className="navbar-brand" href="/">
          Nerd Shirts
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarText"
          aria-controls="navbarText"
          aria-expanded="false"
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <a className="nav-link" href="/">
                Home
              </a>
            </li>
          </ul>
          <a className="navbar-text ms-auto" href="/cart">
            {`Cart: ${
              quantities?.reduce((total, quantity) => total + quantity, 0) ?? 0
            }`}
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
