
var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var jq_location = path.join(__dirname, 'node_modules/jquery');

module.exports = {
    mode: 'development',
    devtool: '#source-map',
    context: __dirname,
    optimization: {
        splitChunks: {
            cacheGroups: {
                default: false,
                commons: {
                    test: /node_modules/,
                    name: "vendor",
                    chunks: "initial",
                    minSize: 1
                }
            }
        }
    },
    entry: {
        javascript: './src/main.js'.replace("/", path.sep)
    },
    resolve: {
        alias: {

        },
        symlinks: false
    },
    devServer: {
        disableHostCheck: true
    },
    output: {
        path: path.join(__dirname, "dist"),
        publicPath: "",
        filename: "[name]-[hash].js",
        chunkFilename: "[name]-[chunkhash].js",
        hotUpdateMainFilename: "[hash]/update.json".replace("/", path.sep),
        hotUpdateChunkFilename: "[hash]/js/[id].update.js".replace("/", path.sep)
    },
    module: {
        rules: [
            {
                test: /\.(ttf|eot|svg|mp3|png|jpg|woff(2)?)(.*)?$/,
                loader: 'file-loader'
            },
            {
                test: /\.css$/,
                use: [
                  'style-loader',
                  'css-loader'
                ]
            },
            {
                test: /\.html$/,
                exclude: /(node_modules|bower_components)/,
                loader: "html-loader?attrs[]=source:src&attrs[]=img:src&attrs[]=section:data-image-src"
            },
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                options: {
                    presets: ['es2015', 'stage-0'],
                    plugins: ['transform-runtime', "angularjs-annotate"],
                    cacheDirectory: true
                }
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            'window.jQuery': jq_location,
            'jQuery': jq_location,
            $: jq_location
        }),
        new HtmlWebpackPlugin({
            template: 'index.ejs',
            inject: 'body',
            filename: 'index.html'
        }),
        new webpack.DefinePlugin({
            DEBUG: true,
            'typeof global': JSON.stringify('undefined')
        })
    ]
};
