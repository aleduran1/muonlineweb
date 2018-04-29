const path = require('path');
const webpack = require('webpack'); //to access built-in plugins
const srcPath = `./src/bundles`;
const config = {
  entry: {
    app: `${srcPath}/app.js`,
    webshop: `${srcPath}/webshop.js`,
    marketplace: `${srcPath}/marketplace.js`,
    donate: `${srcPath}/donate.js`,
    news: `${srcPath}/news.js`,
    ranking: `${srcPath}/ranking.js`
  },
  output: {
    path: path.resolve(__dirname, 'assets/js'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['es2015', 'stage-0'],
          plugins: ['transform-runtime'],
          babelrc: false
        }
      }
    }]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: (module) => module.context && module.context.indexOf('node_modules') !== -1,
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      countdown: "countdown"
    }),
    //new webpack.optimize.UglifyJsPlugin(),
  ],
};

module.exports = config;