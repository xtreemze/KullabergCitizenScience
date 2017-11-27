const webpack = require("webpack");
// const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReloadPlugin = require("reload-html-webpack-plugin");

//
module.exports = function e(env) {
  return {
    entry: {
      entry: "./entry.js"
    },
    output: {
      path: __dirname + "/public",
      // publicPath: "./public/",
      filename: "./js/[name].js?[hash]",
      chunkFilename: "./js/[id].js?[hash]"
    },
    stats: {
      warnings: false
    },
    devtool: "cheap-module-source-map",
    module: {
      rules: [
        {
          test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: "url-loader?limit=1000000000&mimetype=application/font-woff"
        },
        {
          test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: "url-loader?limit=3000000000&name=./img/[name].[ext]?[hash]"
        },
        {
          test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: "file-loader?name=./img/[name].[ext]?[hash]"
        },
        // {
        //   test: /\.scss$/,
        //   exclude: /node_modules/,
        //   loader:
        //     "style-loader!css?sourceMap!sass-loader?sourceMap&sourceComments"
        // },
        {
          test: /\.(scss|sass|css)$/,
          use: [
            {
              loader: "style-loader" // creates style nodes from JS strings
            },
            {
              loader: "css-loader" // translates CSS into CommonJS
            },
            {
              loader: "sass-loader" // compiles Sass to CSS
            }
          ]
        },
        // {
        //   test: /\.(scss|sass|css)$/,
        //   use: ExtractTextPlugin.extract({
        //     fallback: "style-loader",
        //     use: [
        //       {
        //         loader: "css-loader",
        //         options: {
        //           minimize: false,
        //           sourceMap: true,
        //           importLoaders: 1
        //         }
        //       },
        //       "postcss-loader"
        //       // "sass-loader"
        //     ]
        //   })
        // },
        {
          test: /\.(gif|png|jpe?g)$/i,
          loaders: [
            // "file-loader?name=./[name].[ext]"
            "url-loader?limit=300"
            // "url-loader?name=./[name].[ext]"
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
      new ReloadPlugin()
      // new ExtractTextPlugin("./css/[name].css?[chunkhash]")
    ]
  };
};
