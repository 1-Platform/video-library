import React from "react";
import ReactDOM from "react-dom";
import * as Sentry from "@sentry/react";

import pkg from "../package.json";
import "@patternfly/react-core/dist/styles/base.css";
import App from "./App";

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    release: `op-video-library-spa@${pkg.version}`,
    environment: "production",
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
}

const renderApp = () => {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById("root")
  );
};
window.OpAuthHelper ? window.OpAuthHelper.onLogin(renderApp) : renderApp();
