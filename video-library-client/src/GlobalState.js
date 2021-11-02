import globalHook from "use-global-hook";

const initialState = {
  page: 1,
  perPage: 9,
  videos: [],
  videoCount: 1,
  searchTerm: "",
  sortBy: "Newest first",
};

const actions = {
  setPage: (store, pageNumber) => {
    store.setState({ page: pageNumber });
  },
  setVideoCount: (store, count) => {
    store.setState({ videoCount: count });
  },
  setSortBy: (store, sortBy) => {
    store.setState({ sortBy: sortBy });
  },
  setSearchTerm: (store, value) => {
    store.setState({ searchTerm: value });
  },
  setVideos: (store, value) => {
    store.setState({ videos: value });
  },
};

const useGlobal = globalHook(initialState, actions);
export default useGlobal;
