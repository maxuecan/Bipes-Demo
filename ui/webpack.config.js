console.log('开始打包')
const os = require('os')
const path = require('path')
const webpack = require('webpack')
// const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require('terser-webpack-plugin')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
const PreloadWebpackPlugin = require('@vue/preload-webpack-plugin')
// const WorkboxPlugin = require('workbox-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin') // 复制文件或目录的插件
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; // 分析打包后的包大小

const CompressionPlugin = require('compression-webpack-plugin'); // 压缩输出文件

const threads = os.cpus().length; // cpu核数

function formatDefine(target) {
  const result = {};

  for (const key in target) {
      const element = target[key];

      if (typeof element === 'boolean' || typeof element === 'number') {
          result[key] = element;
      } else {
          result[key] = JSON.stringify(element);
      }
  }

  return result;
}

// 用来获取处理样式的loader
function getStyleLoader(pre) {
  return [
    MiniCssExtractPlugin.loader,
    "css-loader",
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: [
            'postcss-preset-env', // 能解决大多数样式兼容性问题
          ]
        }
      }
    },
    pre,
  ].filter(Boolean)
}
console.log('环境参数：',process.env.NODE_BASE_URL)
module.exports = {
  // entry: './index.js',
  entry: {
    index: './index.js'
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'js/build.[contenthash:10].js',
    // filename: 'js/[name].js',
    // 给打包输入的其他文件命名
    chunkFilename: 'js/[name].[contenthash:10].js',
    // chunkFilename: 'js/[name].js',
    // 图片，字体等通过type:asset处理资源命名方式
    assetModuleFilename: 'media/[hash:10][ext][query]',
    // 自动清空上次打包的内容
    // 原理：在打包前，将path整个目录内容清空，再进行打包
    publicPath: '/',
    clean: true
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.css$/,
            use: getStyleLoader()
          },
          {
            test: /\.(png|jpe?g|gif|webp|svg)$/,
            type: 'asset/resource',
            parser: {
              dataUrlCondition: {
                // 小于10kb的图片转base64
                // 有点：减少请求数量  缺点：体积变大
                maxSize: 10 * 1024, // 10kb
              }
            },
            // generator: {
            //   // 输出图片名称
            //   filename: 'static/images/[hash:10][ext][query]'
            // }
          },
          {
            test: /\.(ttf|woff2?|map3|map4|avi)$/,
            type: 'asset/resource',
            generator: {
              filename: 'static/media/[hash:10][ext][query]'
            }
          },
          {
            test: /\.js$/,
            exclude: /node_modules/,
            // loader: 'babel-loader',
            use: [
              {
                loader: 'thread-loader', // 开启多进程
                options: {
                  works: threads, // 进程数量
                }
              },
              {
                loader: 'babel-loader',
                options: {
                  cacheDirectory: true, // 开启babel缓存
                  cacheCompression: false, // 关闭缓存文件压缩
                  plugins: ['@babel/plugin-transform-runtime'], // 减少代码体积
                }
              }
            ]
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
          }
        ]
      }
    ]
  },
  plugins: [
    // new ESLintPlugin({
    //   // 检测哪些文件
    //   context: path.resolve(__dirname, 'src'),
    //   exclude: 'node_modules',
    //   cache: true, // 开启缓存
    //   cacheLocation: path.resolve(
    //     __dirname,
    //     "./node_modules/.cache/eslintcache"
    //   ),
    //   threads, // 开启多进程和设置进程数量
    // }),
    new HtmlWebpackPlugin({
      // 模版，以public/index.html文件创建新的html文件
      // 新的html文件特点： 1，结构和原来一样  2，自动引入打包输出的资源
      template: path.resolve(__dirname, './index.html')
    }),
    new MiniCssExtractPlugin({
      filename: 'bipes-style.css',
      chunkFilename: 'bipes-style.chunk.css'
    }),
    new PreloadWebpackPlugin({
      rel: 'preload',
      as: 'script'
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'core'),
          to: 'core'
        },
        // {
        //   from: path.resolve(__dirname, 'pylibsBlobs'),
        //   to: 'pylibsBlobs',
        //   transform(content, path) {  
        //     return content;  
        //   },  
        // },
        {
          from: path.resolve(__dirname, 'plugins'),
          to: 'plugins'
        },
        {
          from: path.resolve(__dirname, 'msg'),
          to: 'msg'
        },
        {
          from: path.resolve(__dirname, 'b'),
          to: 'b'
        },
        {
          from: path.resolve(__dirname, 'manifest.json')
        },
        {
          from: path.resolve(__dirname, 'toolbox'),
          to: 'toolbox' 
        },
        {
          from: path.resolve(__dirname, 'blockly'),
          to: 'blockly'
        },
        {
          from: path.resolve(__dirname, 'devinfo'),
          to: 'devinfo'
        },
        {
            from: path.resolve(__dirname, 'bipesStyle.css'),
            to: 'bipesStyle.css' 
        }
      ]
    }),
    new webpack.DefinePlugin(
      formatDefine({
        'NODE_ENV': process.env.NODE_ENV,
        'NODE_BASE_URL': process.env.NODE_BASE_URL || '',
      })
    ),
    // new BundleAnalyzerPlugin(),
    new CompressionPlugin({
      algorithm: 'gzip', // 使用gzip压缩
      test: /\.js(\?.*)?$/i, // 匹配需要压缩的文件
      threshold: 10240, // 只有大于此大小的文件会被压缩（以字节为单位）
      minRatio: 0.8, // 压缩率比，小于这个值的文件将不会被压缩
      deleteOriginalAssets: false, // 是否删除原文件
    })
    // new WorkboxPlugin.GenerateSW({
    //   // 这些选项帮助快速启用 ServiceWorkers
    //   // 不允许遗留任何“旧的” ServiceWorkers
    //   clientsClaim: true,
    //   skipWaiting: true,
    // }),
    // new webpack.DllReferencePlugin({
    //   context: path.join(__dirname),
    //   manifest: require('./dll/manifest.json')
    // })
  ],
  optimization: {
    splitChunks: {
      chunks: 'all', // 对所有模块都进行分割
      // name: 'lib.min',
      // 以下是默认值
      // minSize: 20000, // 分割代码最小的大小
      // minRemainingSize: 0, // 类似于minSize，最后确保提取的文件大小不能为0
      // minChunks: 1, // 至少被引用的次数，满足条件才会代码分割
      // maxAsyncRequests: 30, /// 按需加载时并行加载的文件的最大数量
      // maxInitialRequests: 30, // 入口js文件最大并行请求数量
      // enforceSizeThreshold: 50000, // 超过50kb一定会单独打包（此时会忽略minRemainingSize, maxAsyncRequests, maxInitalRequests）
      cacheGroups: { // 组，哪些模块要打包到一个组
        // defaultVendors: { // 组名
        //   test: /[\\/]node_modules[\\/]/, // 需要打包到一起的模块
        //   priority: -10, // 权重（最大越高）
        //   reuseExistingChunk: true, // 如果当前chunk包含已从主bundle中拆分出的模块，则它将被重用，而不是生成新的模块
        // },
        // default: { // 其他没有写的配置会使用上面的默认值
        //   miniSize: 0, // 我们定义的文件体积大小了，所以要改打包的最小文件体积
        //   minChunks: 2, // 这里的minChunks权重更大
        //   priority: -20,
        //   reuseExistingChunk: true,
        // }
      }
    },
    minimize: true, // 压缩代码
    minimizer: [
      // 压缩css
      new CssMinimizerPlugin(),
      // 压缩js
      new TerserWebpackPlugin({
        parallel: threads, // 开启多进程和设置进程数量
        terserOptions: {
          compress: true, // 压缩代码
          mangle: true, // 重命名变量，压缩代码
          output: {
            comments: false, // 去掉注释
          }
        }
      }),
      // 压缩图片
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminGenerate,
          options: {
            plugins: [
              ['gifsicle', { interlaced: true }],
              ['jpegtran', { progressive: true }],
              ['optipng', { optimizationLevel: 5 }],
              [
                'svgo',
                {
                  plugins: [
                    "preset-default",
                    "prefixIds",
                    {
                      name: 'sortAttrs',
                      params: {
                        xmlnsOrder: 'alphabetical'
                      }
                    }
                  ]
                }
              ]
            ]
          }
        }
      })
    ],
    // runtimeChunk: {
    //   name: (entrypoint) => `runtime~${entrypoint.name}.js`
    // }
    runtimeChunk: {
      name: 'lib.min'
    }
  },
  mode: 'production',
  performance: {
    hints:'warning',
    //入口起点的最大体积
    maxEntrypointSize: 50000000,
    //生成文件的最大体积
    maxAssetSize: 30000000,
    //只给出 js 文件的性能提示
    assetFilter: function(assetFilename) {
      return assetFilename.endsWith('.js');
    }
  },
  // devtool: 'source-map',
  // devtool: 'cheap-module-source-map',
  devServer: {
    port: 3010,
    proxy: {
      // '': '',
      // '': {
      //   target: '',
      //   ws: true
      // }
    }
  }
}