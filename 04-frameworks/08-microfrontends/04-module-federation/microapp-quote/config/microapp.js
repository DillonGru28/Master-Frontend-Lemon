const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const CopyWebpackPlugin = require("copy-webpack-plugin");
const helpers = require("./helpers");

module.exports = (env = {}) => ({
  entry: "./microapp-quote.entrypoint.tsx",
  output: {
    path: helpers.buildMicroappPath,
    filename: `${helpers.bundleName}.js`,
    chunkFilename: `${helpers.bundleName}.[id].js`,
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "QuoteContainer",
      filename: "quote-container.js",
      exposes: {
        "./QuoteWidget": "./microapp-quote.entrypoint",
      },
      shared: ["react", "react-dom", "react-router-dom", "emotion"],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: `${helpers.rootPath}/package.json`,
          to: `${helpers.buildMicroappPath}/package.json`,
        },
        {
          from: `${helpers.srcPath}/microapp.d.ts`,
          to: `${helpers.buildMicroappPath}/${helpers.bundleName}.d.ts`,
        },
      ],
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      openAnalyzer: false,
      reportFilename: "report/report.html",
    }),
  ],
});
