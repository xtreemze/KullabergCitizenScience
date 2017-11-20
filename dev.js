const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
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
          test: /\.(eot|ttf|woff|woff2|svg)$/,
          loader: "url-loader?limit=100"
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"]
        },
        {
          test: /\.(gif|png|jpe?g)$/i,
          loaders: ["file-loader"]
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
      })
    ]
  };
};
