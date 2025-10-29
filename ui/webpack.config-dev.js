const os = require("os");
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin') // 复制文件或目录的插件

const threads = os.cpus().length; // cpu核数

function formatDefine(target) {
    const result = {};

    for (const key in target) {
        const element = target[key];

        if (typeof element === "boolean" || typeof element === "number") {
            result[key] = element;
        } else {
            result[key] = JSON.stringify(element);
        }
    }

    return result;
}

module.exports = {
    entry: {
        index: "./index.js",
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        // filename: 'js/build.[contenthash:10].js',
        filename: "js/[name].js",
        // 给打包输入的其他文件命名
        chunkFilename: "js/[name].[contenthash:10].js",
        // chunkFilename: 'js/[name].js',
        // 图片，字体等通过type:asset处理资源命名方式
        assetModuleFilename: "media/[hash:10][ext][query]",
        // 自动清空上次打包的内容
        // 原理：在打包前，将path整个目录内容清空，再进行打包
        publicPath: '/',
        clean: true
    },
    module: {
        rules: [
            // loader配置
            {
                // 每个文件只能被其中一个loader配置处理
                oneOf: [
                    {
                        test: /\.css$/,
                        use: ["style-loader", "css-loader"],
                    },
                    {
                        test: /\.less$/,
                        use: ["style-loader", "css-loader", "less-loader"],
                    },
                    {
                        test: /\.s[ac]ss$/,
                        use: [
                            // 将 JS 字符串生成为 style 节点
                            "style-loader",
                            // 将 CSS 转化成 CommonJS 模块
                            "css-loader",
                            // 将 Sass 编译成 CSS
                            "sass-loader",
                        ],
                    },
                    {
                        test: /\.styl$/,
                        loader: "stylus-loader", // 将 Stylus 文件编译为 CSS
                    },
                    // {
                    //     test: /\.(png|jpe?g|gif|webp|svg)$/,
                    //     type: "asset",
                    //     parser: {
                    //         dataUrlCondition: {
                    //             // 小于10kb的图片转base64
                    //             // 有点：减少请求数量  缺点：体积变大
                    //             maxSize: 10 * 1024, // 10kb
                    //         },
                    //     },
                    //     // generator: {
                    //     //   // 输出图片名称
                    //     //   filename: 'static/images/[hash:10][ext][query]'
                    //     // }
                    // },
                    {
                        test: /\.(png|jpe?g|gif|webp|svg)$/i,
                        type: 'asset/resource',
                        parser: {
                            dataUrlCondition: {
                                // 小于10kb的图片转base64
                                // 有点：减少请求数量  缺点：体积变大
                                maxSize: 10 * 1024, // 10kb
                            },
                        },
                        generator: {
                            filename: 'media/[hash:10][ext][query]'
                        }
                    },
                    {
                        test: /\.(ttf|woff2?|map3|map4|avi|ogg|wav)$/,
                        type: "asset/resource",
                        generator: {
                            filename: "static/media/[hash:10][ext][query]",
                        },
                    },
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        use: [
                            {
                                loader: "thread-loader", // 开启多进程
                                options: {
                                    works: threads, // 进程数量
                                },
                            },
                            {
                                loader: "babel-loader",
                                options: {
                                    cacheDirectory: true, // 开启babel缓存
                                    cacheCompression: false, // 关闭缓存文件压缩
                                    plugins: ["@babel/plugin-transform-runtime"], // 减少代码体积
                                },
                            },
                        ],
                        // include: path.resolve(__dirname, './src'),
                        // loader: 'babel-loader',
                        // options: {
                        //   cacheDirectory: true, // 开启babel缓存
                        //   cacheCompression: false, // 关闭缓存文件压缩
                        // }
                        // use: {
                        //   loader: 'babel-loader',
                        //   options: {
                        //     presets: ['@babel/preset-env']
                        //   }
                        // }
                    },
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            // 模版，以public/index.html文件创建新的html文件
            // 新的html文件特点： 1，结构和原来一样  2，自动引入打包输出的资源
            template: path.resolve(__dirname, "./index.html"),
        }),
        new webpack.DefinePlugin(
            formatDefine({
                NODE_ENV: process.env.NODE_ENV,
                NODE_BASE_URL: process.env.NODE_BASE_URL || "",
            })
        ),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'core'),
                    to: 'core'
                },
                {
                    from: path.resolve(__dirname, 'plugins'),
                    to: 'plugins'
                },
                {
                    from: path.resolve(__dirname, 'msg'),
                    to: 'msg'
                },
                {
                    from: path.resolve(__dirname, 'manifest.json')
                },
                {
                    from: path.resolve(__dirname, 'devinfo'),
                    to: 'devinfo'
                },
                {
                    from: path.resolve(__dirname, 'b'),
                    to: 'b',
                },
                {
                    from: path.resolve(__dirname, 'media'),
                    to: 'media'
                },
                {
                    from: path.resolve(__dirname, 'toolbox'),
                    to: 'toolbox' 
                },
                {
                    from: path.resolve(__dirname, 'blockly'),
                    to: 'blockly' 
                }
            ]
        })
    ],
    mode: "development",
    devtool: "cheap-module-source-map",
    // 开发服务器 npx webpack serve
    devServer: {
        port: 5001, // 启动服务器端口号
        open: false, // 是否自动打开浏览器
        hot: true, // 开启HMR（默认值）
        client: {
            // 控制台提示内容
            logging: "none",
            overlay: true,
        },
        https: true,
        static: {
            directory: path.join(__dirname, "/media"),
        }
    },
};
