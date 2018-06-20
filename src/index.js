import './css/index.scss';

import React, { Component } from "react";
import { render } from "react-dom";


class App extends Component {
  render() {
    return <div>测试</div>;
  }
}

const DOM = document.getElementById("app");

const renderDOM = () => {
  render(<App />, DOM);
};

/* 热加载与热更新 */
if (module.hot) {
  module.hot.accept([], () => {
    renderDOM()
  });
}

renderDOM();



