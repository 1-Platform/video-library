import React, { useState, useEffect } from "react";
import {
  Form,
  FormGroup,
  TextInput,
  Checkbox,
  TextArea,
  Button,
  Tabs,
  Tab,
  TabTitleText,
  TabTitleIcon,
  InputGroup,
  ActionGroup,
  Bullseye,
  Radio,
} from "@patternfly/react-core";
import VideoAPIs from "../services/VideoAPIs";
import useGlobal from "../GlobalState";
import { PlusCircleIcon } from "@patternfly/react-icons";

const VideoForm = (props) => {
  const video = props.video;
  // Ancilliary states
  const [activeTabKey, setActiveTabKey] = useState(0);
  const [showLength, setShowLength] = useState(!!video?.approxLength);
  const [advanceFields, setAdvanceFields] = useState(!!video?.tags?.length);
  const [canAdd, setCanAdd] = useState(false);
  // Video property state
  const [videoURL, setVideoURL] = useState(video?.videoURL || "");
  const [title, setTitle] = useState(video?.title || "");
  const [description, setDescription] = useState(video?.description || "");
  const [mailingLists, setMailingLists] = useState(
    video?.mailingLists.join() || ""
  );
  const [approxLength, setApproxLength] = useState(video?.approxLength || "");
  const [tags, setTags] = useState(video?.tags.join() || "");
  const [isVideoShared, setVideoShared] = useState(false);
  // Global state
  const [globalState, globalActions] = useGlobal();

  useEffect(() => {
    setCanAdd(
      title && description && videoURL && approxLength && isVideoShared
    );
  }, [title, description, videoURL, approxLength, isVideoShared]);

  const handleDescUpdate = (value) => {
    setDescription(value);
  };

  const handleMailingListUpdate = (value) => {
    setMailingLists(value);
  };

  const handleTitleUpdate = (value) => {
    setTitle(value);
  };

  const handleTagUpdate = (value) => {
    setTags(value);
  };

  const testVideoURL = () => {
    window.open(videoURL, "_blank");
  };

  const toggleAdvancedFields = () => {
    setAdvanceFields(!advanceFields);
  };
  const handleTabClick = (event, tabIndex) => {
    event.preventDefault();
    setActiveTabKey(tabIndex);
  };
  const handleLengthChange = (checked, event) => {
    setApproxLength(event.currentTarget.value);
  };

  const signIn = () => {
    const url = `${process.env.REACT_APP_DRIVE_SIGN_IN_URL}?redirect_uri=${process.env.REACT_APP_CLIENT}/video-library&prompt=consent&response_type=code&client_id=${process.env.REACT_APP_DRIVE_CLIENT_ID}&scope=${process.env.REACT_APP_DRIVE_SCOPE}&access_type=offline`;
    window.location = url;
  };

  const updateVideo = () => {
    const updatedVideo = {
      ...video,
      title,
      description,
      videoURL,
      approxLength,
      updatedOn: new Date(),
      updatedBy: window.OpAuthHelper?.getUserInfo().rhatUUID,
      createdBy: video.createdBy?.rhatUUID,
      mailingLists: mailingLists.split(",").map((list) => list.trim()),
      skipEmail: process.env.REACT_APP_SKIP_EMAIL === "true",
      tags: tags.split(",").map((tag) => tag.trim()),
    };
    VideoAPIs.updateVideo(updatedVideo)
      .then((data) => {
        if (window.OpNotification) {
          window.OpNotification.success({
            subject: `Video updated successfully!`,
          });
        }
      })
      .catch((err) => {
        if (window.OpNotification) {
          window.OpNotification.danger({
            subject: err.message,
            body: `There was a problem while updating the video. Please try again in sometime.`,
          });
        } else {
          console.error(err);
        }
      })
      .then(() => {
        return VideoAPIs.listVideos();
      })
      .then((videos) => {
        globalActions.setVideos(videos);
        props.handleModalClose();
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
  };

  const addVideo = () => {
    const newVideo = {
      title,
      description,
      videoURL,
      approxLength,
      createdBy: window.OpAuthHelper?.getUserInfo().rhatUUID,
      createdOn: new Date(),
      mailingLists: mailingLists.split(",").map((list) => list.trim()),
      skipEmail: process.env.REACT_APP_SKIP_EMAIL === "true",
      tags: tags.split(",").map((tag) => tag.trim()),
    };
    if (newVideo) {
      VideoAPIs.addVideo(newVideo)
        .then((data) => {
          if (window.OpNotification) {
            window.OpNotification.success({
              subject: `Video added successfully!`,
            });
          }
        })
        .catch((err) => {
          if (window.OpNotification) {
            window.OpNotification.danger({
              subject: err.message,
              body: `There was a problem while adding the video. Please try again in sometime.`,
            });
          } else {
            console.error(err);
          }
        })
        .then(() => {
          return VideoAPIs.listVideos();
        })
        .then((videos) => {
          globalActions.setVideos(videos);
          props.handleModalClose();
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
    }
  };
  const toggleVideoLength = (value) => {
    setVideoURL(value);
    if (value && !showLength) {
      setShowLength(true);
    }
    if (!value) {
      setShowLength(false);
    }
  };
  return (
    <Form onSubmit={(e) => e.preventDefault()}>
      <div className="form-container">
        <div>
          <FormGroup label="Video Title" isRequired fieldId="title-input">
            <TextInput
              isRequired
              id="title-input"
              placeholder="Title of the video"
              name="title"
              value={title}
              onChange={handleTitleUpdate}
              aria-label="Video title"
            />
          </FormGroup>
          <FormGroup label="Description" isRequired fieldId="description-input">
            <TextArea
              isRequired
              placeholder="Description of the video"
              id="description-input"
              name="description"
              value={description}
              onChange={handleDescUpdate}
              aria-label="Video Description"
            />
          </FormGroup>
        </div>
        <div>
          <Tabs
            isFilled
            activeKey={activeTabKey}
            onSelect={handleTabClick}
            isBox={true}
          >
            <Tab
              eventKey={0}
              title={
                <>
                  <TabTitleIcon>
                    <ion-icon name="link-outline"></ion-icon>
                  </TabTitleIcon>{" "}
                  <TabTitleText>Add URL</TabTitleText>{" "}
                </>
              }
            >
              <InputGroup>
                <Button
                  className="test-url-btn"
                  variant="link"
                  onClick={testVideoURL}
                >
                  Test <ion-icon name="open-outline"></ion-icon>
                  <span
                    className="pf-c-form__label-required"
                    aria-hidden="true"
                  >
                    {" "}
                    *
                  </span>
                </Button>
                <TextInput
                  isRequired
                  name="videoURL"
                  type="url"
                  value={videoURL}
                  aria-label="Video URL"
                  placeholder="Enter a Video URL here"
                  onChange={toggleVideoLength}
                />
              </InputGroup>
              {showLength && (
                <div className="duration-radio-group">
                  <Radio
                    id="one-minutes"
                    isChecked={approxLength === "< 1 min"}
                    name="approxLength"
                    onChange={handleLengthChange}
                    label="< 1 min"
                    value="< 1 min"
                  />
                  <Radio
                    id="three-minutes"
                    isChecked={approxLength === "< 3 min"}
                    name="approxLength"
                    onChange={handleLengthChange}
                    label="< 3 min"
                    value="< 3 min"
                  />
                  <Radio
                    id="five-minutes"
                    isChecked={approxLength === "< 5 min"}
                    name="approxLength"
                    onChange={handleLengthChange}
                    label="< 5 min"
                    value="< 5 min"
                  />
                  <Radio
                    id="more-than-five-minutes"
                    isChecked={approxLength === "> 5 min"}
                    name="approxLength"
                    onChange={handleLengthChange}
                    label="> 5 min"
                    value="> 5 min"
                  />
                </div>
              )}
            </Tab>
            <Tab
              eventKey={1}
              title={
                <>
                  <TabTitleIcon>
                    <ion-icon name="cloud-upload"></ion-icon>
                  </TabTitleIcon>{" "}
                  <TabTitleText>Upload Video</TabTitleText>{" "}
                </>
              }
            >
              <Bullseye>
                <Button
                  icon={<ion-icon name="logo-google"></ion-icon>}
                  variant="danger"
                  onClick={signIn}
                >
                  {" "}
                  Sign In
                </Button>
              </Bullseye>
            </Tab>
            <Tab
              eventKey={2}
              title={
                <>
                  <TabTitleIcon>
                    <ion-icon name="logo-google"></ion-icon>
                  </TabTitleIcon>{" "}
                  <TabTitleText>Select from Drive</TabTitleText>{" "}
                </>
              }
            >
              <Bullseye>
                <div className="drive-upload-body">
                  This feature is not available yet.
                </div>
              </Bullseye>
            </Tab>
          </Tabs>
          <FormGroup
            label="CC the following Mailing Lists"
            fieldId="ccemail-input"
          >
            <TextInput
              type="email"
              id="ccemail-input"
              name="mailingLists"
              value={mailingLists}
              onChange={handleMailingListUpdate}
              aria-label="Mailing Lists"
            />
          </FormGroup>
          {advanceFields && (
            <FormGroup
              label="Custom Tags (To improve searchability)"
              fieldId="tags-input"
            >
              <TextInput
                type="text"
                name="tags"
                id="tags-input"
                value={tags}
                onChange={handleTagUpdate}
                placeholder="Enter comma seperated tags"
                aria-label="Tags for the video"
              />
            </FormGroup>
          )}
        </div>
      </div>
      <FormGroup isRequired fieldId="isDownloadable">
        <Checkbox
          isRequired
          onClick={(e) => setVideoShared(e.target.checked)}
          label="I confirm that this video is editable by all the Red Hat users"
          id="isDownloadable"
          name="isDownloadable"
          aria-label="I confirm that this video is editable by all the Red Hat users"
        />
      </FormGroup>
      <ActionGroup>
        <Button
          key="submit"
          variant="primary"
          onClick={props.video ? updateVideo : addVideo}
          icon={<PlusCircleIcon />}
          isDisabled={!canAdd}
        >
          {props.video ? "Update Video" : "Add Video"}
        </Button>
        <Button
          key="cancel"
          variant="secondary"
          onClick={props.handleModalClose}
        >
          Cancel
        </Button>
        <Button
          className="advanced-fields-icon"
          icon={
            <ion-icon
              name={advanceFields ? "remove-outline" : "add-outline"}
            ></ion-icon>
          }
          key="Show Advanced Fields"
          variant="tertiary"
          onClick={toggleAdvancedFields}
        >
          {advanceFields ? "Hide" : "Show"} Advanced Fields
        </Button>
      </ActionGroup>
    </Form>
  );
};
export default VideoForm;
