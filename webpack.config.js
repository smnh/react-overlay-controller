const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {

    entry: './src/components/Overlay/OverlayController.js',

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js'
    },

    devtool: "source-map",

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: "babel-loader"
            },
            {
                test: /\.css$/,
                use: [
                    { loader: "style-loader" },
                    { loader: "css-loader" }
                ]
            }
        ]
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new webpack.optimize.UglifyJsPlugin({sourceMap: true})
    ],

    externals: [nodeExternals()]

};
