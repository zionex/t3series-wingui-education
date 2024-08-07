const path = require('path');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const webpack = require("webpack");

const VIEW_PATH = 'view'
class BuildTimePlugin {
  apply(compiler) {
    compiler.hooks.done.tap('BuildTimePlugin', stats => {
      setImmediate(() => {
        console.log(`[${new Date().toLocaleString()}] Build Complete`);
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
    chunkFilename: 'js/bundle/[name].bundle.js',
    sourceMapFilename: 'js/bundle/[name].js.map',
    libraryTarget: 'window',
    path: path.resolve(__dirname, '../../src/main/webapp')
  },
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    runtimeChunk: false,
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]((?!(realgrid)).*)[\\/]/,
          name: 'vendor',
          chunks: 'all',
          minChunks: 1
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
    }),
    new BuildTimePlugin()
  ],
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
    ignored: ['**/node_modules/**'],
  }
}
