const path = require("path");
const webpack = require('webpack')
const dotenv = require('dotenv')

// this will update the process.env with environment variables in .env file
dotenv.config();


module.exports = {
    entry: "./src/app.js",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
        publicPath: "/",
    },

    devServer: {
        static: {
            directory: path.join(__dirname, "./dist")
        },
        allowedHosts: ['all'],
        historyApiFallback: true
    },


    plugins: [
        // ...
        new webpack.DefinePlugin({
            'process.env': JSON.stringify(process.env),
        })
        // ...
    ],

    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.js$/i,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: ["file-loader"]
            },

        ],

    },


}