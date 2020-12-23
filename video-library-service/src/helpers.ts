// write your helper functions here
import fetch from "node-fetch";
import https from "https";

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
    fetchUserDetails(query: String){
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `bearer: ${process.env.API_KEY}`,
      };
      const agent = new https.Agent({
        rejectUnauthorized: false,
      });
    
      const options = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({query: query}),
        agent: agent,
      };
      return fetch(`${process.env.API_GATEWAY_URL}`, options)
      .then( res => res.json() )
    }
    getMultipleUserDetails(videos: Video[]){
      let userIDs = videos.reduce((acc: any, video:any) => {
        if (!!video.createdBy && acc.findIndex( (user: any) => ""+video.createdBy === ""+user.rhatUUID ) === -1) {
          acc.push({ rhatUUID: video.createdBy });
        }
        if (!!video.updatedBy && acc.findIndex( (user: any) => ""+video.updatedBy === ""+user.rhatUUID ) === -1) {
          acc.push({ rhatUUID: video.updatedBy });
        }
        return acc;
      }, <any[]>[]);
      console.log("userIDs", userIDs);
      const query = /* GraphQL */`
        query UserDetails {
          ${
            userIDs
              .map( (user: any, index: number) => `u${index}: getUsersBy(rhatUUID:"${user.rhatUUID}"){ name uid rhatUUID }`)
              .join('')
            }
          }
      `;
      return this.fetchUserDetails(query);
    }
  }
export default VideoLibraryHelpers.getInstance();
