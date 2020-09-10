import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";

import "@patternfly/react-core/dist/styles/base.css";
import VideoLibrary from "./VideoLibrary";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import AddModal from "./video/AddModal";
import WatchModal from "./video/WatchModal";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Switch>
        <Route path="/" component={VideoLibrary} />
        <Route>{"404"}</Route>
      </Switch>
      <Route path="/add" component={AddModal} />
      <Route path="/watch/:id" component={WatchModal} />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
