import React, { useState, useEffect } from "react";
import {
  Form,
  FormGroup,
  TextInput,
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

const AddForm = (props) => {
  // Ancilliary states
  const [activeTabKey, setActiveTabKey] = useState(0);
  const [showLength, setShowLength] = useState(false);
  const [advanceFields, setAdvanceFields] = useState(false);
  const [canAdd, setCanAdd] = useState(false);
  // Video property state
  const [videoURL, setVideoURL] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mailingLists, setMailingLists] = useState("");
  const [approxLength, setApproxLength] = useState("");
  const [tags, setTags] = useState("");
  // Global state
  const [globalState, globalActions] = useGlobal();

  useEffect(() => {
    setCanAdd(title && description && mailingLists && approxLength);
  }, [title, description, mailingLists, approxLength]);

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
  const addVideo = () => {
    const newVideo = {
      title,
      description,
      videoURL,
      approxLength,
      mailingLists: mailingLists
        .split(",")
        .map((list) => list.replace(" ", "")),
      skipEmail: true,
      tags: tags.split(",").map((list) => list.replace(" ", "")),
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
              body: `There was some problem adding the video. Please try again in sometime.`,
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
              body: `There was some problem fetching all the videos. Please try again in sometime.`,
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
                </Button>
                <TextInput
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
                    isChecked={approxLength === "< 1 min"}
                    name="approxLength"
                    onChange={handleLengthChange}
                    label="< 1 min"
                    value="< 1 min"
                  />
                  <Radio
                    isChecked={approxLength === "< 3 min"}
                    name="approxLength"
                    onChange={handleLengthChange}
                    label="< 3 min"
                    value="< 3 min"
                  />
                  <Radio
                    isChecked={approxLength === "< 5 min"}
                    name="approxLength"
                    onChange={handleLengthChange}
                    label="< 5 min"
                    value="< 5 min"
                  />
                  <Radio
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
      <ActionGroup>
        <Button
          key="submit"
          variant="primary"
          onClick={addVideo}
          icon={<PlusCircleIcon />}
          isDisabled={!canAdd}
        >
          Add Video
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
          Show Advanced Fields
        </Button>
      </ActionGroup>
    </Form>
  );
};
export default AddForm;
