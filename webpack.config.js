var HTMLWebpackPlugin = require('html-webpack-plugin')

var HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
    template: __dirname + '/src/template.html',
    filename: 'template.html',
    inject: 'body'
})

module.exports = {
    entry: __dirname + '/src/index.js',
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
        filename: "transformed.js",
        path: __dirname + '/build'
    },
    plugins: [HTMLWebpackPluginConfig],

    devServer: {
        open: 'google-chrome', // change to 'chrome' in windows
        index: "template.html",
        proxy:{
            '/api': 'http://localhost:3001'
        }
    }


}