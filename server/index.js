const path = require("path");
const express = require("express");
const webpack = require("webpack");
const ip = require("ip");
const chalk = require("chalk");
const webpackDevMiddleware = require("webpack-dev-middleware");
/* 热加载与热更新 */
const webpackHotMiddleware = require("webpack-hot-middleware");
let webpackConfig = require("../webpack/webpack.dev.config");
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