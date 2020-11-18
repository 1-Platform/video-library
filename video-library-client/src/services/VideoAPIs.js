import Helpers from "./Helpers";
import {
  addVideo,
  listVideos,
  incrementViewCount,
  updateVideo,
} from "./GqlQueries";

export default {
  /**
   * Fetches all the videos
   */
  listVideos: () => {
    return Helpers.fetchClient({
      query: listVideos,
    }).then((data) => data.listVideos);
  },
  /**
   * Adds the videos
   * @param {object} video
   */
  addVideo: (video) => {
    return Helpers.fetchClient({
      query: addVideo,
      variables: { video },
    }).then((data) => data.addVideo);
  },
  /**
   * Increment the video views by ID
   * @param {ID} videoID
   */
  incrementViewCount: (id) => {
    return Helpers.fetchClient({
      query: incrementViewCount,
      variables: { id },
    }).then((data) => data.incrementViewCount);
  },
  /**
   * Updates the video
   * @param {object} video
   */
  updateVideo: (video) => {
    return Helpers.fetchClient({
      query: updateVideo,
      variables: { video },
    }).then((data) => data.updateVideo);
  },
};
