var HTMLWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin');

var HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
    template: __dirname + '/src/template.html',
    filename: 'template.html',
    inject: 'body'
})

module.exports = {
    mode : 'development',
    entry: {
        main: __dirname + '/src/index.js',
        admin: __dirname + '/src/admin/admin.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.css/,

                loader: ['style-loader', 'css-loader']
            }
        ]
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/build'
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: __dirname + '/src/template.html',
            filename: 'template.html',
            chunks: ['main'],
            inject: 'body'
        }),
        new HTMLWebpackPlugin({
            template: 'src/admin/admin.html',
            filename: 'admin.html',
            chunks: ['admin'],
            inject: 'body'
        })
    ],
    

    watchOptions:{
        ignored: ['node_modules', 'build'],

    },

    devServer: {
        open: 'google-chrome', // change to 'chrome' in windows
        index: "template.html",
        proxy: {
            '/api': 'http://localhost:3001'
        }
    }


}