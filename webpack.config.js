const resolve = require('path').resolve
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const WebpackMd5Hash = require('webpack-md5-hash')
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const url = require('url')
const publicPath = ''

module.exports = (options = {}) => ({
    entry: {
        vendor: './src/vendor',
        index: './src/main.js'
    },
    output: {
        path: resolve(__dirname, 'dist'),
        filename: options.dev ? '[name].js' : '[name].[chunkhash:8].js',
        chunkFilename: '[id].[chunkhash:8].js',
        publicPath: options.dev ? '/assets/' : publicPath
    },
    module: {
        rules: [{
            test: /\.vue$/,
            use: ['vue-loader']
        }, {
            test: /\.js$/,
            use: ['babel-loader'],
            exclude: /node_modules/
        }, {
            test: /\.css$/,
            use: ['style-loader', 'css-loader', 'postcss-loader'],

        }, {
            test: /\.(png|jpg|jpeg|gif)(\?.+)?$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 1000,
                    name: 'css/img/[name].[hash:8].[ext]'
                }
            }]
        }, {
            test: /\.(eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'css/font/[name].[hash:8].[ext]'
                }
            }]
        }]
    },
    devtool: "source-map",
    plugins: [
        new WebpackMd5Hash(),
        new webpack.HashedModuleIdsPlugin(),
        new CompressionWebpackPlugin({ //gzip 压缩
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp(
                '\\.(js|css)$' //压缩 js 与 css
            ),
            threshold: 10240,
            minRatio: 0.8
        }),
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            inject: true, // 自动注入
            minify: {
                removeComments: true, //去注释
                collapseWhitespace: true, //压缩空格
                removeAttributeQuotes: true //去除属性引用
            },
            //必须通过上面的 CommonsChunkPlugin 的依赖关系自动添加 js，css 等
            chunksSortMode: 'dependency'
        }),
        new ExtractTextPlugin({ filename: 'css/[name].[contenthash:8].css' }),
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor', 'manifest']
        }),
        new InlineManifestWebpackPlugin({
            name: 'webpackManifest'
        })
    ],
    resolve: {
        alias: {
            '~': resolve(__dirname, 'src')
        }
    },
    devServer: {
        host: '127.0.0.1',
        port: 8023,
        proxy: {
            '/api/': {
                target: '127.0.0.1',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/'
                }
            }
        },
        historyApiFallback: {
            index: url.parse(options.dev ? '/assets/' : publicPath).pathname
        }
    },
    devtool: options.dev ? '#eval-source-map' : '#source-map'
});