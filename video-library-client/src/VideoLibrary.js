import React from "react";
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
          <Controls openAddModal={openAddModal} />
          <VideoGallery openAddModal={openAddModal} />
          <PaginationBottom />
        </Page>
      </React.Fragment>
    </div>
  );
};

export default VideoLibrary;
