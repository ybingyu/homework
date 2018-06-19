const path = require("path");
const merge = require("webpack-merge");
const baseConfig = require("./webpack.base.config");
const glob = require("glob");

const webpack = require("webpack");
//文件夹操作插件配置
const CopyWebpackPlugin = require("copy-webpack-plugin"); // 复制静态资源的插件
const CleanWebpackPlugin = require("clean-webpack-plugin"); // 清空打包目录的插件
const HtmlWebpackPlugin = require("html-webpack-plugin"); //模板HtmlWebpackPlugin插件相关配置，注意压缩

// const UglifyJsPlugin = require("uglifyjs-webpack-plugin"); //js代码压缩插件
const WebpackParallelUglifyPlugin = require("webpack-parallel-uglify-plugin");

//css压缩、去除死代码、生成.css文件的插件配置
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSPlugin = require("optimize-css-assets-webpack-plugin");
const PurifyCSSPlugin = require("purifycss-webpack");

module.exports = merge(baseConfig, {
  entry: {
    polyfill: ["babel-polyfill"],
    main: [path.join(process.cwd(), "src/prod.js")]
  },
  output: {
    // 这里是文件名配置规则
    filename: "[name].[chunkhash:5].js",
    // 文件块名配置规则
    chunkFilename: "[name].[chunkhash:5].chunk.js",
    // 这里根据实际的上限规则配置
    publicPath: "/"
  },
  module: {
    rules: [{
        //处理自己的css文件
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              autoprefixer: true || {
                /*自己的配置*/
              }
            }
          }
        ]
      },
      {
        //处理自己的scss/sass文件
        test: /\.(scss|sass)$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              importLoaders: 1
            }
          },
          "postcss-loader",
          "sass-loader"
        ]
      }, {
        test: /\.(js|jsx)$/,
        enforce: "post",
        loaders: ["es3ify-loader"],
        include: [
          path.resolve(process.cwd(), "./src"),
          // path.resolve(process.cwd(), "./node_modules/axios"),
          path.resolve(process.cwd(), "./node_modules/babel-polyfill")
        ]
      }
    ]
  },
  // 新增优化配置，压缩插件配置在plugins黎明会被覆盖哦
  // https://webpack.js.org/configuration/optimization/
  optimization: {
    //webpack4.x的最新优化配置项，用于提取公共代码
    // https://webpack.docschina.org/plugins/split-chunks-plugin/
    splitChunks: {
      cacheGroups: {
        commons: {
          chunks: "initial", //有三个值可能"initial"，"async"和"all"。配置时，优化只会选择初始块，按需块或所有块。
          name: "common", //名字
          minChunks: 2, //分割前的代码最大块数
          maxInitialRequests: 5, // entry(入口)的并行请求数
          minSize: 30000 // 最小值
        }
      }
    },
    //是否压缩
    // minimize: false
    minimizer: [
      // 多入口使用
      new WebpackParallelUglifyPlugin({
        uglifyJS: {
          output: {
            beautify: false, //不需要格式化
            comments: false //不保留注释
          },
          compress: {
            properties: false, //属性
            warnings: false, // 在UglifyJs删除没有用到的代码时不输出警告
            drop_console: true, // 删除所有的 `console` 语句，可以兼容ie浏览器（生产环境就没有log了）
            collapse_vars: true, // 内嵌定义了但是只用到一次的变量
            reduce_vars: true // 提取出出现多次但是没有定义成变量去引用的静态值
          },
          ie8: true // 兼容ie8的精髓，简单且强大
        }
      })
      // 单入口使用（如果多入口使用和这个，编译后的js会有问题[真的坑]）
      // new UglifyJsPlugin({
      //   uglifyOptions: {
      //     compress: {
      //       properties: false,
      //       warnings: false
      //     },
      //     output: {
      //       // beautify: true,
      //       quote_keys: true
      //     },
      //     ie8: true
      //   },
      //   sourceMap: true
      // })
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
      // 页面压缩相关配置
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      },
      inject: true
    }),
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),
    new PurifyCSSPlugin({
      paths: glob.sync(path.resolve(process.cwd(), "src/*.html"))
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new CopyWebpackPlugin([{
      from: path.resolve(process.cwd(), "src/lib"), //lib对象文件夹
      to: path.resolve(process.cwd(), "build/lib"), //lib目标文件夹
      ignore: [".*"]
    }]),
    new CleanWebpackPlugin(["build"], {
      root: path.resolve(process.cwd()),
      verbose: true,
      dry: false
    })
  ],
  performance: {
    hints: false
  },
  resolve: {
    mainFields: ['main']
  }
});