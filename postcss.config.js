module.exports = {
  plugins: [
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
