const path = require('path');

const webpack = require('webpack');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const targetEnv = process.env.TARGET_ENV || 'firefox';
const isProduction = process.env.NODE_ENV === 'production';

let plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      TARGET_ENV: JSON.stringify(targetEnv)
    },
    global: {}
  }),
  new VueLoaderPlugin(),
  new MiniCssExtractPlugin({
    filename: '[name]/style.css'
  }),
  isProduction ? new LodashModuleReplacementPlugin({shorthands: true}) : null
];
plugins = plugins.filter(Boolean);

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: {
    background: './src/background/main.js',
    options: './src/options/main.js',
    action: './src/action/main.js',
    upload: './src/upload/main.js',
    results: './src/results/main.js',
    confirm: './src/confirm/main.js',
    browse: './src/browse/main.js',
    select: './src/select/main.js',
    capture: './src/capture/main.js',
    contribute: './src/contribute/main.js',
    parse: './src/parse/main.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist', 'src'),
    chunkFilename: '[name]/script.js'
  },
  optimization: {
    runtimeChunk: {
      name: 'manifest'
    },
    splitChunks: {
      cacheGroups: {
        default: false,
        commonsUi: {
          name: 'commons-ui',
          chunks: chunk => {
            return [
              'options',
              'action',
              'browse',
              'select',
              'capture',
              'upload',
              'results',
              'confirm',
              'contribute'
            ].includes(chunk.name);
          },
          minChunks: 2
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader'
      },
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              transformAssetUrls: {img: ''}
            }
          }
        ]
      },
      {
        test: /\.(c|sc|sa)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              includePaths: ['node_modules']
            }
          }
        ]
      }
    ]
  },
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    extensions: ['.js', '.json', '.css', '.scss', '.vue']
  },
  devtool: false,
  plugins
};
