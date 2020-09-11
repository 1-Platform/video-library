import React from "react";
import ReactDOM from "react-dom";

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
      </Switch>
      <Route path="/add" component={AddModal} />
      <Route path="/watch/:id" component={WatchModal} />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
