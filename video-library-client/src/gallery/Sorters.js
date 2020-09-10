import React, { useState } from "react";
import useGlobal from "../GlobalState";
import { Select, SelectVariant, SelectOption } from "@patternfly/react-core";

const Sorters = () => {
  const [sortByExpanded, setSortByExpanded] = useState(false);
  const [globalState, globalActions] = useGlobal();

  const options = [
    { value: "Name" },
    { value: "Most viewed" },
    { value: "Newest first" },
    { value: "Oldest first" },
  ];
  const onSortBySelect = (event, selection) => {
    globalActions.setSortBy(selection);
    setSortByExpanded(false);
    globalActions.setPage(1);
  };
  const onSortByToggle = () => {
    setSortByExpanded(!sortByExpanded);
  };

  const sortByOptions = options.map((option, index) => (
    <SelectOption
      isDisabled={option.disabled}
      key={index}
      value={option.value}
    />
  ));

  return (
    <React.Fragment>
      <Select
        variant={SelectVariant.single}
        aria-label="Select Input"
        onToggle={onSortByToggle}
        onSelect={onSortBySelect}
        selections={globalState.sortBy}
        isOpen={sortByExpanded}
        aria-labelledby="Select sort by option"
      >
        {sortByOptions}
      </Select>
    </React.Fragment>
  );
};

export default Sorters;
