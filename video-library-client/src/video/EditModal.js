import React from "react";
import { Modal } from "@patternfly/react-core";
import AddForm from "./AddForm";
import { useHistory, useLocation } from "react-router-dom";

const EditModal = () => {
  let history = useHistory();
  const location = useLocation();
  const video = location.state.video;
  const handleModalClose = () => {
    history.goBack();
  };
  return (
    <React.Fragment>
      <Modal
        title={`Edit Video: ${video.title}`}
        isOpen={true}
        width={"80%"}
        onClose={handleModalClose}
        onEscapePress={handleModalClose}
      >
        <AddForm video={video} handleModalClose={handleModalClose} />
      </Modal>
    </React.Fragment>
  );
};
export default EditModal;
