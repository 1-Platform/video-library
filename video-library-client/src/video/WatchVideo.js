import React, { useEffect } from "react";
import { Label, Button } from "@patternfly/react-core";
import VideoAPIs from "../services/VideoAPIs";
import useGlobal from "../GlobalState";

const WatchVideo = (props) => {
  const [globalState, globalActions] = useGlobal();
  useEffect(() => {
    VideoAPIs.incrementVideoViewCount(props.video._id)
      .then((updatedViews) => {
        let newArray = [...globalState.videos];
        let index = newArray.findIndex(
          (video) => video._id === props.video._id
        );
        newArray[index] = { ...props.video, views: updatedViews };
        globalActions.setVideos(newArray);
      })
      .catch((err) => {
        if (window.OpNotification) {
          window.OpNotification.danger({
            subject: err.message,
            body: `There was a problem incrementing the views. Please try again in sometime.`,
          });
        } else {
          console.error(err);
        }
      });
  }, []);

  const openVideoInTab = () => {
    window.open(props.video.videoURL, "_blank");
  };
  return (
    <div className="video-container">
      {props.video?.videoURL && (
        <Button
          icon={<ion-icon name="open-outline"></ion-icon>}
          className="open-video-link"
          isInline
          variant="link"
          iconPosition="right"
          onClick={openVideoInTab}
        >
          Open in New Tab
        </Button>
      )}
      <figure className="video-figure">
        {props.video.videoURL ? (
          {
            drive: (
              <video className="embed-responsive-item" controls>
                <source
                  src={`https://drive.google.com/uc?export=download&id=${props.video.fileID}`}
                />
                Your browser does not support HTML5 Videos. Please try a
                different browser, or click{" "}
                <a
                  href={props.video.videoURL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  here
                </a>{" "}
                to view the video on Google Drive
              </video>
            ),
            youtube: (
              <iframe
                className="embed-responsive-item"
                src={`https://www.youtube.com/embed/${props.video.fileID}?rel=0`}
                allowFullScreen
                title="Youtube video"
              ></iframe>
            ),
          }[props.video.source] || (
            <div className="empty-state-container">
              <p>This video source is not supported for preview.</p>
            </div>
          )
        ) : (
          <div className="empty-state-container">
            <p>Could not find the Video URL.</p>
          </div>
        )}
      </figure>

      <section className="video-details-section">
        <h5>Video Description:</h5>
        <p className="video-description">
          {props.video.description || "Not provided."}
        </p>
        <div>
          <div>
            <h5>Added by:</h5>
            <p>{props.video.createdBy?.name || ""}</p>
          </div>
        </div>
        <h5>Additional Tags:</h5>
        <div className="tags-container">
          {props.video.tags.map((tag, index) => (
            <Label key={index} variant="outline" color="green">
              {tag}
            </Label>
          ))}
        </div>
      </section>
    </div>
  );
};

export default WatchVideo;
