const path = require('path');
const webpack = require('webpack');
const TsConfigWebpackPlugin = require('ts-config-webpack-plugin');
const ScssConfigWebpackPlugin = require('scss-config-webpack-plugin');
const FontConfigWebpackPlugin = require('font-config-webpack-plugin');

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
    filename: '[name].js',
    publicPath: '/js/'
  },
  resolve: {
    extensions: [
      '.ts',
      '.tsx',
      '.js'
    ]
  },
  mode: 'development',
  optimization: {
    usedExports: true,
    sideEffects: false
  },
  devtool: 'inline-source-map',
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development'
    }),
    new TsConfigWebpackPlugin({
      configFile: 'tsconfig.compilation.json'
    }),
    new ScssConfigWebpackPlugin(),
    new FontConfigWebpackPlugin()
  ],
  devServer: {
    host: '0.0.0.0',
    port: 4000,
    compress: false,
    historyApiFallback: true,
    inline: true,
    disableHostCheck: true,
    proxy: {
      '/': {
        target: 'http://localhost:3000',
        secure: false
      }
    },
    watchOptions: {
      poll: 1000,
      ignored: [
        'node_modules'
      ]
    },
    stats: {
      color: true
    }
  }
};
