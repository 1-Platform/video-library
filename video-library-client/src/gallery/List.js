import React from "react";
import { Select, SelectVariant, SelectOption } from "@patternfly/react-core";

const List = (props) => {
  return (
    <React.Fragment>
      <Select
        variant={SelectVariant.single}
        aria-label="Select Input"
        onToggle={props.onToggle}
        onSelect={props.onSelect}
        selections={props.selections}
        isExpanded={props.isExpanded}
        ariaLabelledBy="Select sort by option"
      >
        {props.options.map((option, index) => (
          <SelectOption
            isDisabled={option.disabled}
            key={index}
            value={option.value}
          />
        ))}
      </Select>
    </React.Fragment>
  );
};

export default List;
