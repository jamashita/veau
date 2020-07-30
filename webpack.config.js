const path = require('path');
const webpack = require('webpack');
const FontConfigWebpackPlugin = require('font-config-webpack-plugin');
const ScssConfigWebpackPlugin = require('scss-config-webpack-plugin');
const TsConfigWebpackPlugin = require('ts-config-webpack-plugin');

/**
 * @type import('webpack').Configuration
 */
module.exports = {
  entry: {
    app: [
      path.resolve(__dirname, 'src', 'Frontend', 'App.tsx')
    ]
  },
  output: {
    filename: '[name].js'
  },
  resolve: {
    extensions: [
      '.ts',
      '.tsx',
      '.js'
    ]
  },
  mode: 'production',
  optimization: {
    usedExports: true,
    sideEffects: false
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production'
    }),
    new TsConfigWebpackPlugin({
      configFile: 'tsconfig.esm.json'
    }),
    new ScssConfigWebpackPlugin(),
    new FontConfigWebpackPlugin()
  ]
};
