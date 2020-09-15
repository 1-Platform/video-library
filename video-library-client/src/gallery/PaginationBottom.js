import React from "react";
import { Pagination } from "@patternfly/react-core";
import useGlobal from "../GlobalState";
import { Toolbar, ToolbarItem, ToolbarContent } from "@patternfly/react-core";

const PaginationBottom = () => {
  const [globalState, globalActions] = useGlobal();
  const defaultPerPageOptions = [
    {
      title: "1",
      value: 9,
    },
  ];
  return (
    <React.Fragment>
      <Toolbar>
        <ToolbarContent>
          <ToolbarItem variant="pagination">
            <Pagination
              itemCount={globalState.videoCount}
              page={globalState.page}
              perPage={globalState.perPage}
              perPageOptions={defaultPerPageOptions}
              onSetPage={(_evt, value) => {
                globalActions.setPage(value);
              }}
              variant="bottom"
              dropDirection="up"
            />
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>
    </React.Fragment>
  );
};

export default PaginationBottom;
