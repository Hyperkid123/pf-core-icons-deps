import React from 'react';
import App from 'next/app';
import Head from 'next/head';

export default class MyApp extends App {
  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <React.Fragment>
        <Head>
          <title>PF build</title>
        </Head>
        <Component { ...pageProps } />
      </React.Fragment>
    );
  }
}
