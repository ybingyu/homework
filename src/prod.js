import './css/index.css';

import React, { Component } from "react";
import { render } from "react-dom";


class App extends Component {
  render() {
    return <div>测试prod</div>;
  }
}

const DOM = document.getElementById("app");

const renderDOM = () => {
  render(<App />, DOM);
};



renderDOM();



