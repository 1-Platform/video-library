import React from "react";
import { Modal } from "@patternfly/react-core";
import VideoForm from "./VideoForm";
import { useHistory } from "react-router-dom";

const AddModal = () => {
  let history = useHistory();
  const handleModalClose = () => {
    history.goBack();
  };
  return (
    <React.Fragment>
      <Modal
        title="Add Video"
        isOpen={true}
        width={"80%"}
        onClose={handleModalClose}
        onEscapePress={handleModalClose}
      >
        <VideoForm handleModalClose={handleModalClose} />
      </Modal>
    </React.Fragment>
  );
};
export default AddModal;
