const TerserPlugin = require('terser-webpack-plugin');
const withCSS = require('@zeit/next-css');
const resolve = require('resolve');
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
});
const path = require('path');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(withMDX(withCSS({
  pageExtensions: [ 'js', 'jsx', 'md', 'mdx' ],
  cssLoaderOptions: {
    url: false,
  },
  webpack: (config, options) => {
    const { dir, isServer, ...rest } = options;
    config.externals = [];
    if (isServer) {
      config.externals.push((context, request, callback) => {
        resolve(
          request,
          { basedir: dir, preserveSymlinks: true },
          (err, res) => {
            if (err) {
              return callback();
            }

            // Next.js by default adds every module from node_modules to
            // externals on the server build. This brings some undesirable
            // behaviors because we can't use modules that require CSS files like
            // `former-kit-skin-pagarme`.
            //
            // The lines below blacklist webpack itself (that cannot be put on)
            if (
              res.match(/node_modules[/\\].*\.js/) &&
              !res.match(/node_modules[/\\]webpack/) &&
              !res.match(/node_modules[/\\]@patternfly\/react-core/) &&
              !res.match(/node_modules[/\\]@patternfly\/react-styles/) &&
              !res.match(/node_modules[/\\]library/)
            ) {
              return callback(null, `commonjs ${request}`);
            }

            callback();
          }
        );
      });
    }

    config.module.rules.push({
      test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 100000,
        },
      },
    });
    //config.module.rules.push({
    //  test: /\.(sa|sc|c)ss$/,
    //  use: [ 'style-loader', 'css-loader', 'sass-loader' ],
    //})
    // Fixes npm packages that depend on `fs` module
    config.node = {
      fs: 'empty',
    };

    config.optimization.minimizer = [
      new TerserPlugin({
        cache: true,
        parallel: false,
        terserOptions: {
          keep_classnames: true, // eslint-disable-line
          keep_fnames: true, // eslint-disable-line
        },
      }),
    ];
    return config;
  },
})));
