import React from "react";
import { SearchIcon } from "@patternfly/react-icons";
import { PlusCircleIcon } from "@patternfly/react-icons";
import {
  InputGroup,
  TextInput,
  Button,
  Toolbar,
  ToolbarItem,
  ToolbarContent,
} from "@patternfly/react-core";
import Sorters from "./Sorters";
import useGlobal from "../GlobalState";

const Controls = (props) => {
  const [globalState, globalActions] = useGlobal();
  const SearchBox = () => {
    const updateSearchTerm = (value) => {
      globalActions.setSearchTerm(value);
    };
    return (
      <div className="search-wrapper">
        <InputGroup>
          <TextInput
            autoFocus
            name="search-input"
            value={globalState.searchTerm}
            type="search"
            placeholder="Search videos by title, description, tags, createdBy, source"
            aria-label="Search videos by title, description, tags, createdBy, source"
            onChange={updateSearchTerm}
          />
          <Button
            variant="control"
            name="search"
            aria-label="Search button for video"
          >
            <SearchIcon />
          </Button>
        </InputGroup>
      </div>
    );
  };

  return (
    <Toolbar>
      <ToolbarContent>
        <ToolbarItem>
          <SearchBox />{" "}
        </ToolbarItem>
        <ToolbarItem variant="label">Sort By:</ToolbarItem>
        <ToolbarItem>
          <Sorters />
        </ToolbarItem>
        <ToolbarItem className="add-video-btn">
          <Button
            variant="primary"
            icon={<PlusCircleIcon />}
            onClick={props.openAddModal}
          >
            {" "}
            Add Video
          </Button>
        </ToolbarItem>
      </ToolbarContent>
    </Toolbar>
  );
};
export default Controls;
