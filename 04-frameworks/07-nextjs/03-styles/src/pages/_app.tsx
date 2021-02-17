import React from 'react';
import { AppProps } from 'next/app';
import { ThemeProviderComponent } from '../common/theme';

const App: React.FunctionComponent<AppProps> = (props) => {
  const { Component, pageProps } = props;
  console.log('App render')

  return (
    <ThemeProviderComponent>
      <Component {...pageProps} />
    </ThemeProviderComponent>
  );
};

export default App;
