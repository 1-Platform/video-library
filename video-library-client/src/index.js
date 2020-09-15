import React from "react";
import ReactDOM from "react-dom";

import "@patternfly/react-core/dist/styles/base.css";
import VideoLibrary from "./VideoLibrary";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import AddModal from "./video/AddModal";
import EditModal from "./video/EditModal";
import WatchModal from "./video/WatchModal";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter basename={process.env.REACT_APP_PUBLIC_URL}>
      <Switch>
        <Route path="/" component={VideoLibrary} />
      </Switch>
      <Route path="/add" component={AddModal} />
      <Route path="/watch/:id" component={WatchModal} />
      <Route path="/edit/:id" component={EditModal} />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
