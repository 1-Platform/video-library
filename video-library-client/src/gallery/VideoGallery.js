import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Button,
  Gallery,
  PageSection,
  Spinner,
  Bullseye,
} from "@patternfly/react-core";
import useGlobal from "../GlobalState";
import { PlusCircleIcon } from "@patternfly/react-icons";
import { NavLink } from "react-router-dom";
import VideoAPIs from "../services/VideoAPIs";
import Helpers from "../services/Helpers";
import ReactTooltip from "react-tooltip";

const VideoGallery = (props) => {
  const [loading, setLoading] = useState(true);
  const [pageVideos, setPageVideos] = useState([]);
  const [globalState, globalActions] = useGlobal();
  const { page, perPage, sortBy, searchTerm, videos } = globalState;

  /**
   * Sorter for sorting the list of videos based on the criteria
   */
  const sorter = (a, b) => {
    let result = 0;
    switch (sortBy) {
      case "Name":
        result = a.title.toUpperCase() < b.title.toUpperCase() ? -1 : 1;
        break;
      case "Most viewed":
        result = a.views > b.views ? -1 : 1;
        break;
      case "Newest first":
        result = a.createdOn < b.createdOn ? 1 : -1;
        break;
      case "Oldest first":
        result = a.createdOn < b.createdOn ? -1 : 1;
        break;
      default:
        result = a.title.toUpperCase() > b.title.toUpperCase() ? 1 : -1;
    }
    return result;
  };

  const extractSetPerPageVideos = (videos) => {
    const pageVideos = videos.slice((page - 1) * perPage, page * perPage);
    setPageVideos(pageVideos);
  };

  useEffect(() => {
    const filterProps = ["title", "description", "tags", "createdBy", "source"];
    let sortedVideos = videos;
    if (videos.length === 0) {
      VideoAPIs.listVideos()
        .then((videoList) => {
          globalActions.setVideoCount(videoList.length);
          sortedVideos = videoList.sort(sorter);
          if (sortedVideos.length !== 0) {
            globalActions.setVideos(sortedVideos);
          }
          extractSetPerPageVideos(sortedVideos);
          setLoading(false);
        })
        .catch((err) => {
          if (window.OpNotification) {
            window.OpNotification.danger({
              subject: err.message,
              body: `There was a problem while fetching all the videos. Please try again in sometime.`,
            });
          } else {
            console.error(err);
          }
        });
    } else {
      if (searchTerm) {
        sortedVideos = Helpers.multiPropsFilter(
          videos,
          filterProps,
          searchTerm
        );
        globalActions.setVideoCount(sortedVideos.length);
      }
      sortedVideos.sort(sorter);
      extractSetPerPageVideos(sortedVideos);
      globalActions.setVideoCount(sortedVideos.length);
    }
  }, [page, sortBy, searchTerm, videos]);

  return (
    <React.Fragment>
      <PageSection className="video-page-section">
        {loading && (
          <Bullseye className="loader-container">
            <Spinner />
          </Bullseye>
        )}
        {pageVideos.length === 0 && !loading ? (
          <div>
            <div className="no-video-msg">
              No videos found for the selected filters.
            </div>
            <Button
              variant="primary"
              icon={<PlusCircleIcon />}
              onClick={props.openAddModal}
            >
              {" "}
              Add Video
            </Button>
          </div>
        ) : (
          <Gallery hasGutter className="video-gallery">
            {pageVideos.map((video, key) => (
              <React.Fragment key={key}>
                <Card className="card" isHoverable isSelectable isFlat>
                  <CardBody>
                    <section className="video-info">
                      <h5>
                        <NavLink
                          to={{
                            pathname: `/watch/${video._id}`,
                            key: video._id,
                            state: { video: video },
                          }}
                          title="Watch Video"
                        >
                          {video.title || "Title not available"}
                        </NavLink>
                      </h5>
                      <p className="uploaded-by">
                        {video.createdBy?.name || "No owner"}
                      </p>
                      {window.OpAuthHelper &&
                      video.createdBy?.name ===
                        window.OpAuthHelper?.getUserInfo().fullName ? (
                        <NavLink
                          className="edit-video-link"
                          to={{
                            pathname: `/edit/${video._id}`,
                            key: video._id,
                            state: { video: video },
                          }}
                        >
                          <ion-icon name="create-outline"></ion-icon>
                        </NavLink>
                      ) : (
                        <span className="disable-edit-link">
                          <ion-icon
                            name="create-outline"
                            data-tip
                            data-for="edit-tip"
                          ></ion-icon>
                        </span>
                      )}
                      <div className="footer">
                        <span>{Helpers.formatDate(video.createdOn)}</span>
                        <span className="views">
                          {Helpers.roundOffViews(video.views || 0)} views
                        </span>
                      </div>
                    </section>
                    <aside>
                      <NavLink
                        to={{
                          pathname: `/watch/${video._id}`,
                          key: video._id,
                          state: { video: video },
                        }}
                      >
                        <ion-icon name="play-circle-outline"></ion-icon>
                      </NavLink>
                      <div className="info">
                        <ion-icon
                          name={Helpers.getSourceIcon(video.source)}
                          data-tip
                          data-for="source-tip"
                        ></ion-icon>
                        <span className="length">
                          {video.length
                            ? Helpers.humanizeTime(video.length)
                            : video.approxLength
                            ? video.approxLength.toLowerCase()
                            : "N/A"}
                        </span>
                      </div>
                    </aside>
                    <ReactTooltip
                      id="source-tip"
                      place="bottom"
                    >{`Video Source: ${video.source?.toUpperCase()}`}</ReactTooltip>
                    <ReactTooltip id="edit-tip" place="bottom">
                      You are not authorized to edit this video information.
                    </ReactTooltip>
                  </CardBody>
                </Card>
              </React.Fragment>
            ))}
          </Gallery>
        )}
      </PageSection>
    </React.Fragment>
  );
};

export default VideoGallery;
