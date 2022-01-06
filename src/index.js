import React from "react";
import ReactDOM from "react-dom";
import "./base.css";
import App from "./App";
import Context from "./context/app-context";

ReactDOM.render(
  <Context>
    <App />
  </Context>,
  document.getElementById("root")
);
