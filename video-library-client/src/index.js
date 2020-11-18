import React from "react";
import ReactDOM from "react-dom";

import "@patternfly/react-core/dist/styles/base.css";
import App from "./App";

const renderApp = () => {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById("root")
  );
}
window.OpAuthHelper ? window.OpAuthHelper.onLogin(renderApp) : renderApp();
