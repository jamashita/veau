const path = require('path');

module.exports = {
  entry: {
    app: [
      path.resolve(__dirname, 'src', 'veau-frontend', 'App.tsx')
    ]
  },
  output: {
    filename: '[name].js',
    publicPath: '/js/'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  mode: 'development',
  devtool: 'source-map',
  plugins: [
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: 'ts-loader'
      }
    ]
  },
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
      poll: true
    },
    stats: {
      color: true
    }
  }
};
