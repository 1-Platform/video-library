import React from "react";
import { Modal } from "@patternfly/react-core";
import { useHistory, useLocation } from "react-router-dom";
import WatchVideo from "./WatchVideo";
const WatchModal = () => {
  const history = useHistory();
  const location = useLocation();
  const video = location.state.video;
  const title = video.title;
  const handleModalClose = () => {
    history.goBack();
  };
  return (
    <React.Fragment>
      <Modal
        className={video.videoURL ? "title-with-button" : ""}
        title={title}
        isOpen={true}
        width={"55%"}
        onClose={handleModalClose}
        onEscapePress={handleModalClose}
      >
        <WatchVideo video={video} />
      </Modal>
    </React.Fragment>
  );
};
export default WatchModal;
