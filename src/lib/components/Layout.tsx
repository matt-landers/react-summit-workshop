import React from 'react';
import Head from 'next/head';
import Seo, { SeoProps } from 'react-headless-yoast';
import Nav from './Nav';

export interface LayoutProps {
  seo?: Omit<SeoProps, 'MetaRenderElement'>;
}

const Layout: React.FC<LayoutProps> = ({ children, seo }) => {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/favicon.ico" type="image/x-icon" />
      </Head>
      {seo && (
        <Seo
          pageSchema={seo?.pageSchema}
          siteSchema={seo?.siteSchema}
          page={seo?.page ?? { title: 'Nerd Stickers' }}
          MetaRenderElement={Head}
        />
      )}
      <Nav />
      <main className="container">{children}</main>
    </>
  );
};

export default Layout;
