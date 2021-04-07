import React from 'react';
import Head from 'next/head';
import Nav from './Nav';

const Layout: React.FC = ({ children }) => {
  return (
    <>
      <Head>
        <title>Nerd Shirts</title>
      </Head>
      <Nav />
      <main className="container">{children}</main>
    </>
  );
};

export default Layout;
