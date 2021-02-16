import Helpers from "./Helpers";
import {
  addVideo,
  listVideos,
  incrementVideoViewCount,
  updateVideo,
  getVideosBy,
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
  incrementVideoViewCount: (id) => {
    return Helpers.fetchClient({
      query: incrementVideoViewCount,
      variables: { id },
    }).then((data) => data.incrementVideoViewCount);
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
  /**
   * Get the video by video details
   * @param {object} video
   */
  getVideosBy: (video) => {
    return Helpers.fetchClient({
      query: getVideosBy,
      variables: { video },
    }).then((data) => data.getVideosBy);
  },
};
