import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import nodeGlobals from 'rollup-plugin-node-globals';
import { terser } from 'rollup-plugin-terser';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';
import postcss from 'rollup-plugin-postcss';
import { createFilter } from 'rollup-pluginutils';
import async from 'rollup-plugin-async';

const globals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  '@patternfly/react-core': '@patternfly/react-core',
  '@patternfly/react-icons': '@patternfly/react-icons',
};

const pf4Externals = createFilter([
  'react',
  'react-dom',
  'prop-types',
  '@patternfly/react-core/**',
  '@patternfly/react-icons/**',
], null, { resolve: false });

const babelOptions = {
  exclude: /node_modules/,
  runtimeHelpers: true,
  configFile: './babel.config.js',
};

const commonjsOptions = {
  ignoreGlobal: true,
  include: /node_modules/,
};

export default [{
  input: './src/index.js',
  output: {
    file: './index.js',
    format: 'umd',
    name: 'library',
    exports: 'named',
    globals,
  },
  external: pf4Externals,
  plugins: [
    async(),
    nodeResolve(),
    babel(babelOptions),
    commonjs(commonjsOptions),
    nodeGlobals(), // Wait for https://github.com/cssinjs/jss/pull/893
    replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
    sizeSnapshot({ snapshotPath: 'size-snapshot.json' }),
    terser({
      keep_classnames: true,
      keep_fnames: true,
    }),
    postcss({
      inject: true,
    }),
  ],
}];