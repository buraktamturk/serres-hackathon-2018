
var webpack = require('webpack');
var config = require('./webpack.config');

config.plugins.pop();
config.plugins.push(new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
    },
    'typeof global': JSON.stringify('undefined')
}));

delete config.devtool;
config.mode = "production";

module.exports = config;
