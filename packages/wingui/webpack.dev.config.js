const path = require('path');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const webpack = require("webpack");

const VIEW_PATH = 'view'
//const IGNORE_VIEW_PATH = 'view_ag'

class BuildTimePlugin {
  apply(compiler) {
    compiler.hooks.done.tap('BuildTimePlugin', stats => {
      setImmediate(() => {
        console.log(`[${new Date().toLocaleString()}] Build Complete\n\n`);
      });
    });
  }
}

module.exports = {
  mode: 'development',
  entry: {
    main: './src/index.js'
  },
  devtool: 'inline-source-map',
  output: {
    filename: 'js/bundle/[name].js',
    chunkFilename: 'js/bundle/[name].js',
    sourceMapFilename: 'js/bundle/[name].js.map',
    libraryTarget: 'window',
    path: path.resolve(__dirname, '../../src/main/webapp')
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        realgrid: {
          test: /[\\/]node_modules[\\/](realgrid)[\\/]/,
          name: 'realgrid',
          chunks: 'all',
        },
        vendor1: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'vendor1',
          chunks: 'all',
          minChunks: 1,
        },
        vendor2: {
          test: /[\\/]node_modules[\\/](axios|@toast-ui)[\\/]/,
          name: 'vendor2',
          chunks: 'all',
          minChunks: 1,
        },
        commons: {
          name: 'commons',
          minChunks: 1,
          chunks: 'initial',
          priority: -20,
          enforce: true,
        }
      }
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      VIEW_PATH: JSON.stringify(VIEW_PATH),
      //IGNORE_VIEW_PATH: JSON.stringify(IGNORE_VIEW_PATH),
    }),
    new BuildTimePlugin()
  ],
  module: {
    rules: [
      {
        test: /\.(js|mjs|jsx|ts|tsx)?$/,
        exclude: [
          {
            and: [path.resolve(__dirname, "node_modules")],
          }
        ],
        loader: 'esbuild-loader',
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
        use: ["file-loader?name=images/[name].[ext]"]
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
  },
  devServer: {
    historyApiFallback: true,
    port: 3000,
    open: true,
    proxy: {
      '*': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  },
  watchOptions: {
    ignored: ['**/node_modules/**', '**/view_ag/**'],
  }
};
