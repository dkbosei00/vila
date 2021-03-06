const webpack = require('webpack');

const config = {
    entry:  __dirname + '/js/index.js',
    output: {
      path: __dirname + '/static/js/',
        filename: 'app.js',
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  }
};

module.exports = config;
