import React, { useEffect, useState } from 'react';
import { AppContext, AppInitialProps } from 'next/app';
import { HeadlessProvider } from '@wpengine/headless/react';
import { CartContext, createCartContext } from '../lib/shopify';

import '../scss/global.scss';

/* eslint-disable react/jsx-props-no-spreading */
export default function App({
  Component,
  pageProps,
}: AppContext & AppInitialProps) {
  return (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    <CartContext.Provider value={createCartContext()}>
      <HeadlessProvider pageProps={pageProps}>
        <Component {...pageProps} />
      </HeadlessProvider>
    </CartContext.Provider>
  );
}
