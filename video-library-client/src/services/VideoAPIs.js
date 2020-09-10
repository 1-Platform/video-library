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
    })
      .then((data) => data.listVideos)
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
  },
  /**
   * Adds the videos
   * @param {string} ldapCommonName
   */
  addVideo: (video) => {
    return Helpers.fetchClient({
      query: addVideo,
      variables: { video },
    })
      .then((data) => {
        if (window.OpNotification) {
          window.OpNotification.success({
            subject: `Video added successfully!`,
          });
        }
        return data.addGroup;
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
      });
  },
  incrementViewCount: (id) => {
    return Helpers.fetchClient({
      query: incrementViewCount,
      variables: { id },
    })
      .then((data) => data.incrementViewCount)
      .catch((err) => {
        if (window.OpNotification) {
          window.OpNotification.danger({
            subject: err.message,
            body: `There was some problem incrementing the views. Please try again in sometime.`,
          });
        } else {
          console.error(err);
        }
      });
  },
};
