import React, { useEffect, useState } from "react";
import { Modal } from "@patternfly/react-core";
import { useHistory, useLocation, useParams } from "react-router-dom";
import WatchVideo from "./WatchVideo";
import VideoAPIs from "../services/VideoAPIs";
import { Spinner, Bullseye } from "@patternfly/react-core";

const WatchModal = () => {
  const history = useHistory();
  const params = useParams();
  const [video, setVideo] = useState({});
  useEffect(() => {
    VideoAPIs.getVideosBy({ _id: params.id })
      .then((video) => {
        setVideo(video[0]);
      })
      .catch((err) => {
        console.log(err);
        if (window.OpNotification) {
          window.OpNotification.danger({
            subject: err.message,
            body: `Error fetching video details. Please try again in sometime.`,
          });
        } else {
          console.error(err);
        }
        handleModalClose();
      });
  }, []);
  const title = video?.title;
  const handleModalClose = () => {
    history.push("/");
  };
  return (
    <React.Fragment>
      <Modal
        className={video?.videoURL ? "title-with-button" : ""}
        title={title || " "}
        isOpen={true}
        width={"55%"}
        onClose={handleModalClose}
        onEscapePress={handleModalClose}
      >
        {Object.keys(video).length === 0 && video.constructor === Object ? (
          <Bullseye className="loader-container">
            <Spinner />
          </Bullseye>
        ) : (
          <WatchVideo video={video} />
        )}
      </Modal>
    </React.Fragment>
  );
};
export default WatchModal;
