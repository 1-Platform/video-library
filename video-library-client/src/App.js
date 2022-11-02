import React, { createRef, useEffect } from "react";
import VideoLibrary from "./VideoLibrary";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import AddModal from "./video/AddModal";
import EditModal from "./video/EditModal";
import WatchModal from "./video/WatchModal";
import "@patternfly/patternfly/patternfly.css";
import "@one-platform/opc-header/dist/opc-header";
import "@one-platform/opc-footer/dist/opc-footer";
import "./VideoLibrary.css";
import { Banner, Flex, FlexItem } from "@patternfly/react-core";

const App = () => {
  const breadcrumbs = createRef();
  useEffect(() => {
    breadcrumbs.current.opcHeaderBreadcrumb = [
      {
        name: "Home",
        href: "/",
      },
      {
        name: "Video Library",
        href: "/video-library",
      },
    ];
  }, []);
  return (
    <React.StrictMode>
      <Banner screenReaderText="Danger banner" variant="danger">
        <Flex spaceItems={{ default: "spaceItemsSm" }}>
          <FlexItem>
            <ion-icon name="alert-outline"></ion-icon>
          </FlexItem>
          <FlexItem>
            <a
              style={{
                color: "#fff",
              }}
              href="mailto:one-platform-devs@redhat.com"
            >
              The video library is about to be decommissioned on 31 Dec'22.
              Please let us know if you have any questions or concerns.
            </a>
          </FlexItem>
        </Flex>
      </Banner>
      <opc-header heading="Video Library" theme="blue">
        <opc-header-breadcrumb
          ref={breadcrumbs}
          slot="breadcrumb"
        ></opc-header-breadcrumb>
      </opc-header>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Switch>
          <Route path="/" component={VideoLibrary} />
        </Switch>
        <Route path="/add" component={AddModal} />
        <Route path="/watch/:id" component={WatchModal} />
        <Route path="/edit/:id" component={EditModal} />
      </BrowserRouter>
      <opc-footer theme="blue">
        <span slot="copyright">Red Hat. All Rights Reserved.</span>
      </opc-footer>
    </React.StrictMode>
  );
};
export default App;
