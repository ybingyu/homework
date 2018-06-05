const path = require("path");
const merge = require("webpack-merge");

const chalk = require("chalk");
const webpack = require("webpack");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");

module.exports = merge({
  entry: path.resolve(process.cwd(), "src/index.js"),
  output: {
    path: path.resolve(process.cwd(), "build"),
    filename: "[name].js",
    chunkFilename: "[name].chunk.js",
    publicPath: "/"
  },
  devtool: "inline-source-map",
  mode: process.env.NODE_ENV,
  module: {
    rules: [{
        //配置babel
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      //字体文件解析
      {
        test: /\.(eot|svg|otf|ttf|woff|woff2)$/,
        use: "file-loader"
      },
      //图片解析
      {
        test: /\.(jpg|png|gif)$/,
        use: [{
            //引用图片压缩插件
            loader: "image-webpack-loader",
            options: {
              progressive: true,
              optimizationLevel: 7,
              interlaced: false,
              pngquant: {
                quality: "65-90",
                speed: 4
              }
            }
          },
          {
            // url-loader 当图片较小的时候会把图片BASE64编码，
            // 大于limit参数的时候还是使用file-loader 进行拷贝
            // 当使用这个loader时，不需要再使用file-loader
            loader: "url-loader",
            options: {
              // 指定限制
              limit: 10000
            }
          }
        ]
      },
      //html解析
      {
        test: /\.html$/,
        use: "html-loader"
      },
      //json文件解析
      {
        test: /\.json$/,
        use: "json-loader"
      },
      //视频文件解析
      {
        test: /\.(mp4|webm)$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 10000
          }
        }
      }
    ]
  },
   optimization: {
     minimize: false
   },
  plugins: [
    // 环境变量定义插件
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    }),
    // 编译进度条 chalk 标亮
    new ProgressBarPlugin({
      format: "  build [:bar] " + chalk.green.bold(":percent") + " (:elapsed seconds)"
    })
  ]
})