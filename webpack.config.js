const webpack = require('webpack'); //to access built-in plugins
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const sources = [
    './src/script/index.jsx',
    './src/styles/main.scss'
];

const output = {
    path: path.resolve(__dirname, 'static/build'),
    filename: 'bundle.js',
    publicPath: "/static/build/"
};

const scriptLoader = {
    test: /\.jsx?$/,
    loaders: ['babel-loader', "eslint-loader"],
    exclude: /node_modules/,
    include: path.resolve(__dirname, 'src'),
};

const svgLoader = {
    test: /\.svg?$/,
    use: ['babel-loader', 'svg-react-loader',
        {
            loader: 'svgo-loader',
            options: {
                plugins: [
                    { collapseGroups: false }
                ]
            }
        }
    ],
    exclude: /node_modules/,
    include: path.resolve(__dirname, 'src'),
};

const resolver = {
    extensions: ['.js', '.jsx']
};

const productionConfig = {
    entry: sources,
    output: output,
    resolve: resolver,

    module: {
        rules: [
            svgLoader,
            scriptLoader,
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('bundle.css')
    ]
};

const devConfig = {
    entry: sources,
    output: output,
    resolve: resolver,

    devtool: 'source-map',

    module: {
        loaders: [
            svgLoader,
            scriptLoader,
            {
                test: /\.scss$/,
                loaders: ["style-loader", "css-loader", "sass-loader"]
            }
        ]
    },
    devServer: {
        hotOnly: true,
        host: '0.0.0.0',
        disableHostCheck: true,
        historyApiFallback: {
            index: 'index.html'
        }
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin()
    ]
};

module.exports = (env) => {
    if (env === 'production') {
        return productionConfig;
    }

    return devConfig;
};
