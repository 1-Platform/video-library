import React from "react";
import "./VideoLibrary.css";
import { Page } from "@patternfly/react-core";
import Controls from "./gallery/Controls";
import PaginationBottom from "./gallery/PaginationBottom";
import VideoGallery from "./gallery/VideoGallery";
import { useHistory } from "react-router-dom";

const VideoLibrary = (props) => {
  const history = useHistory();
  const openAddModal = () => {
    history.push("/add");
  };

  return (
    <div className="wrapper">
      <React.Fragment>
        <Page>
          <opc-header heading="Video Library">
            <opc-header-breadcrumb slot="breadcrumb"></opc-header-breadcrumb>
            <opc-header-links slot="links"></opc-header-links>
          </opc-header>
          <Controls openAddModal={openAddModal} />
          <VideoGallery openAddModal={openAddModal} />
          <PaginationBottom />
        </Page>
        <opc-footer></opc-footer>
      </React.Fragment>
    </div>
  );
};

export default VideoLibrary;
