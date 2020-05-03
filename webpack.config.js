const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
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
  plugins: [
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new TsConfigWebpackPlugin({configFile: '/foo/bar/tsconfig.json'})
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          }
        ]
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true
      })
    ]
  }
};
