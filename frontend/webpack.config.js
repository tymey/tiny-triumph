const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (_, argv) => ({
  mode: argv.mode || 'development',
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: argv.mode === 'production'
      ? '[name].[contenthash].js'
      : '[name].js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
            'style-loader',
            'css-loader',
            'postcss-loader'    // Runs Tailwind & autoprefixer
        ],
      }
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      filename: 'index.html',
      title: 'Tiny Triumphs'
    })
  ],
  devServer: {
    static: {
        directory: path.join(__dirname, 'dist')
    },
    historyApiFallback: true,
    port: 3000,
    hot: true,
    proxy: [
      // any request to /api/* will be forwarded to the Django server
      {
        context: ['/api'],
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    ],
  }
});
