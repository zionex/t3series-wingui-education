const path = require('path');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const webpack = require("webpack");

const VIEW_PATH = 'view'
const IGNORE_VIEW_PATH = 'view_ag'

module.exports = {
  mode: 'production',
  entry: {
    main: './src/index.js'
  },
  output: {
    filename: 'js/bundle/[name].js',
    chunkFilename: 'js/bundle/[name].bundle.js',
    sourceMapFilename: 'js/bundle/[name].js.map',
    libraryTarget: 'window',
    path: path.resolve(__dirname, '../../src/main/webapp')
  },
  optimization: {
    runtimeChunk: false,
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]((?!(realgrid)).*)[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
        realgrid: {
          test: /[\\/]node_modules[\\/](realgrid)[\\/]/,
          name: 'realgrid',
          chunks: 'all',
        },
        commons: {
          name: 'commons',
          minChunks: 1,
          chunks: 'initial',
        }
      }
    }
  },
  plugins: [
  new webpack.DefinePlugin({
    VIEW_PATH: JSON.stringify(VIEW_PATH),
    IGNORE_VIEW_PATH: JSON.stringify(IGNORE_VIEW_PATH),
  })],
  module: {
    rules: [
      {
        test: /\.(js|mjs|jsx|ts|tsx)?$/,
        loader: 'esbuild-loader',
        exclude: [
          {
            and: [path.resolve(__dirname, "node_modules")],
          }
        ],
        options: {
          loader: 'jsx',
          target: 'es2015'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ["file-loader",]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ["file-loader",]
      },
      {
        test: /\.md$/,
        use: 'raw-loader'
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.scss'],
    modules: ['node_modules'],
    alias: {
      request$: 'xhr',
      '@wingui': path.resolve(__dirname, 'src/')
    }
  }
};
