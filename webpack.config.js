/* eslint-env node */
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

var config = {
    entry: {
        app: [
            './src/script/index.tsx',
            './src/styles/main.scss'
        ]
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        assetModuleFilename: '[file]',
        publicPath: "/",
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.[jt]sx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.svg$/i,
                issuer: /\.[jt]sx?$/,
                use: [
                    {
                        loader: '@svgr/webpack',
                        options: {
                            icon: true,
                            replaceAttrValues: { ['#d6d6d6']: 'currentColor' },
                        },
                    },
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'static/images/[name].[ext]',
                        },
                    },
                ],
            },
            {
                test: /\.(jpe?g|gif|png|woff|woff2|ttf|wav|mp3)$/,
                type: 'asset/resource',
                generator: {
                    emit: false,
                },
            },
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.css', '.scss'],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),
        new MiniCssExtractPlugin(),
    ],
};

module.exports = (env, argv) => {
    if (argv.mode === 'development') {
        config.devtool = 'eval-source-map';
        config.devServer = {
            historyApiFallback: true,
            static: {
                directory: path.join(__dirname, 'static'),
                publicPath: '/static',
            },
        };
    } else if (argv.mode === 'production') {
        config.output.publicPath = 'auto';
        config.optimization = {
            minimize: true,
            minimizer: [new TerserPlugin({
                extractComments: false,
            })],
        };

        config.plugins.push(new CopyPlugin({
            patterns: [
                { from: 'static', to: 'static' },
            ],
        }));
    }

    config.plugins.push(
        new webpack.DefinePlugin({
            'process.env.BASENAME': JSON.stringify(config.output.publicPath),
        })
    );

    return config;
};
