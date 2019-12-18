require.extensions['.css'] = () => undefined;
const experimental = require('@patternfly/react-core/dist/js/experimental');
const layouts = require('@patternfly/react-core/dist/js/layouts');
const components = require('@patternfly/react-core/dist/js/components');

module.exports = {
  "presets": [
    "@babel/preset-env",
    "@babel/preset-react"
  ],
  plugins: [
  [
    'transform-imports',
    {
      '@patternfly/react-core': {
        transform: (importName, matches) => {
          let res = '@patternfly/react-core/dist/js/';
          if (components[importName]) {
            res += 'components';
          } else if (layouts[importName]) {
            res += 'layouts';
          }

          res += `/${importName}/${importName}.js`;
          return res;
        },
        preventFullImport: true,
        skipDefaultConversion: true,
      },
    },
    'react-core',
  ], [
    'transform-imports',
    {
      '@patternfly/react-icons': {
        transform: (importName, matches) => `@patternfly/react-icons/dist/js/icons/${importName.split(/(?=[A-Z])/).join('-').toLowerCase()}`,
        preventFullImport: true,
      },
    },
    'react-icons',
  ] ],
}