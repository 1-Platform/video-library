import Helpers from "./Helpers";
import { addVideo, listVideos, incrementViewCount } from "./GqlQueries";

export default {
  /**
   * Fetches all the videos
   * @param {string} ldapCommonName
   */
  listVideos: () => {
    return Helpers.fetchClient({
      query: listVideos,
    }).then((data) => data.listVideos);
  },
  /**
   * Adds the videos
   * @param {string} ldapCommonName
   */
  addVideo: (video) => {
    return Helpers.fetchClient({
      query: addVideo,
      variables: { video },
    }).then((data) => data.addGroup);
  },
  incrementViewCount: (id) => {
    return Helpers.fetchClient({
      query: incrementViewCount,
      variables: { id },
    }).then((data) => data.incrementViewCount);
  },
};
