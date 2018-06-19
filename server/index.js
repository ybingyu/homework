const path = require("path");
const express = require("express");
const webpack = require("webpack");
const ip = require("ip");
const chalk = require("chalk");
const isDev = process.env.NODE_ENV !== "production"; //是否开发
const proxy = require("http-proxy-middleware"); //proxy

const webpackDevMiddleware = require("webpack-dev-middleware");
/* 热加载与热更新 */
const webpackHotMiddleware = require("webpack-hot-middleware");
let webpackConfig = {};
//增加对==开发环境==与==生产环境==的判断代码
if (isDev) {
  webpackConfig = require("../webpack/webpack.dev.config");
} else {
  webpackConfig = require("../webpack/webpack.prod.config");
}

const comliper = webpack(webpackConfig);
const devMiddle = webpackDevMiddleware(comliper);
let app = express();


const port = 3001;
const host = "localhost";

app.use(webpackHotMiddleware(comliper));


app.use(devMiddle);



app.listen(port, host, err => {
  /* 日志 */
  console.log(`

Localhost: ${chalk.magenta(`http://${host}:${port}`)}
      LAN: ${chalk.magenta(`http://${ip.address()}:${port}`)}

${chalk.blue(`Press ${chalk.italic("CTRL-C")} to stop`)}
    `);
});
//TODO:增加对 https://www.easy-mock.com/ 的代理，转发至根URL即可
const apiProxy = proxy("/", {
  target: "https://www.easy-mock.com/",
  changeOrigin: true
}); //将请求转发
app.use("/api/*", apiProxy); //全目录下的都是用代理
