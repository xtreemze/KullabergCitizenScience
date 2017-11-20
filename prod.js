const OfflinePlugin = require("offline-plugin");
const webpack = require("webpack");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlMinifierPlugin = require("html-minifier-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
//
module.exports = function e(env) {
  return {
    entry: {
      vendor: [
        "./node_modules/materialize-css/dist/js/materialize",
        "./node_modules/materialize-css/dist/css/materialize.css",
        // "./node_modules/mdi/css/materialdesignicons.css",
        "./node_modules/material-design-icons/iconfont/material-icons.css",
        "./app/js/offlineRuntimeInstall",
        "mongodb-stitch"
      ],
      entry: "./entry.js"
    },
    output: {
      path: __dirname + "/public",
      // publicPath: "./public/",
      filename: "./js/[name].js?[chunkhash]",
      chunkFilename: "./js/[id].js?[chunkhash]"
    },
    stats: {
      warnings: true
    },
    // devtool: "cheap-module-source-map",
    module: {
      rules: [
        // {
        //   test: /\.(eot|ttf|woff|woff2|svg)$/,
        //   loader: "url-loader?limit=100000000"
        // },
        {
          test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader:
            "url-loader?limit=10000000&mimetype=application/font-woff"
        },
        {
          test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: "url-loader?limit=300&name=./img/[name].[ext]?[hash]"
        },
        {
          test: /\.(scss|sass|css)$/,
          use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: [
              {
                loader: "css-loader",
                options: {
                  minimize: false,
                  sourceMap: false,
                  importLoaders: 1
                }
              },
              "postcss-loader"
            ]
          })
        },
        {
          test: /\.(gif|png|jpe?g)$/i,
          loaders: [
            "file-loader?name=./img/[name].[ext]?[hash]",
            {
              loader: "image-webpack-loader",
              options: {
                gifsicle: {
                  interlaced: false
                },
                // optipng: {
                //   optimizationLevel: 7
                // },
                pngquant: {
                  quality: "65-90",
                  speed: 4
                },
                mozjpeg: {
                  progressive: true,
                  quality: 65
                }
                // Specifying webp here will create a WEBP version of your JPG/PNG images
                // webp: {
                //   quality: 75
                // }
              }
            }
          ]
        },
        {
          test: /\.js$/,
          exclude: [/node_modules/]
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: "Kullaberg Citizen Science",
        template: "./app/index.ejs"
      }),
      new ExtractTextPlugin("./css/[name].css?[chunkhash]"),
      new webpack.optimize.CommonsChunkPlugin({
        name: "vendor",

        minChunks: Infinity
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: "manifest",
        minChunks: Infinity
      }),
      new UglifyJSPlugin({
        cache: true,
        parallel: true,
        sourceMap: false,
        uglifyOptions: {
          ecma: 8,
          output: {
            comments: false
          }
        }
      }),
      new HtmlMinifierPlugin({
        minifyCSS: true,
        minifyJS: true,
        removeComments: true,
        removeEmptyAttributes: true,
        removeEmtpyElements: true,
        removeOptionalTags: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeStyleLinkTypeAttributes: true,
        sortAttributes: true,
        sortClassName: true,
        minifyURLs: true,
        collapseWhitespace: true,
        collapseInlineTagWhitespace: true,
        collapseBooleanAttributes: true
      }),

      new OfflinePlugin({
        externals: [],
        caches: "all",
        // responseStrategy: "network-first",
        responseStrategy: "cache-first",
        // updateStrategy: "all",
        updateStrategy: "changed",
        minify: "true",
        autoUpdate: 1000 * 60 * 60 * 2,
        ServiceWorker: {
          events: "true"
        },
        AppCache: {
          events: "true"
        }
      })
    ]
  };
};
