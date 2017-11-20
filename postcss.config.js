module.exports = {
  plugins: [
    require("precss"),
    // require("postcss-node-sass"),
    require("cssnano")({
      autoprefixer: false,
      discardComments: { removeAll: true },
      preset: "advanced"
    }),
    require("autoprefixer")
    // require("uncss").postcssPlugin({
    //   html: ["public/*.html", "public/js/"]
    // })
  ]
};
