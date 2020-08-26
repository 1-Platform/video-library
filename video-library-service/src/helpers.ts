// write your helper functions here

class VideoLibraryHelpers {
    private static instance: VideoLibraryHelpers;
  
    public static getInstance() {
      if (!VideoLibraryHelpers.instance) {
        VideoLibraryHelpers.instance = new VideoLibraryHelpers();
      }
      return VideoLibraryHelpers.instance;
    }
  
    /**
     * Finds the video source from a url
     */
    public getVideoSource(videoURL: String | string) {
      if (videoURL) {
        if (videoURL.indexOf("drive.google.com") !== -1) {
          return "drive";
        } else if (videoURL.indexOf("bluejeans.com") !== -1) {
          return "bluejeans";
        } else if (videoURL.indexOf(`${process.env.MOJO}`) !== -1) {
          return "mojo";
        } else if (videoURL.match(/youtu\.?be/i)) {
          return "youtube";
        }
      }
      return "other";
    }
  
    /**
     * Get the fileID from a videoURL
     *
     * (Only works for `Google Drive` or `Youtube` links)
     */
    public getVideoFileID(videoURL: String | string, fallbackID: String): string {
      const regexDictionary: any = {
        youtube: new RegExp(/^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/),
        drive: new RegExp(/[-\w]{25,}/),
      };
  
      const videoSource = this.getVideoSource(videoURL);
  
      if (videoSource === "drive") {
        const regexMatch = regexDictionary["drive"].exec(videoURL);
        if (regexMatch && regexMatch[0]) {
          return String(regexMatch[0]);
        }
      } else if (videoSource === "youtube") {
        const regexMatch = regexDictionary["youtube"].exec(videoURL);
        if (regexMatch && regexMatch[2]) {
          return String(regexMatch[2]);
        }
      }
      return String(fallbackID);
    }
  
    /**
     * Humanizes the video length
     *
     * - Returns a rounded time range for the input time
     */
    humanizeTime(seconds: number, { fallbackString } = { fallbackString: "> 1 min" }) {
      if (!seconds) {
        /**
         * If no time is provided, return the fallbackString, or consider the default to be `> 1 min`
         */
        return fallbackString;
      }
      if (seconds < 60) {
        return "< 1 min";
      } else if (seconds > 60 && seconds < 2 * 60) {
        return "> 1 min";
      } else if (seconds > 2 * 60 && seconds < 5 * 60) {
        return "> 2 min";
      }
      return "> 5 min";
    }
  }
  
  export const VideoLibraryHelper = VideoLibraryHelpers.getInstance();
  export default VideoLibraryHelper;
  
