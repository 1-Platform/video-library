import { VideoLibrary } from './schema';
import nodemailer from "nodemailer";
import { Transporter } from "nodemailer";
import * as _ from "lodash";
import VideoLibraryHelper from "./helpers";
import { MailmanCron } from "./mailmanCron";

const transporter: Transporter = nodemailer.createTransport({
  host: `${process.env.SMTP_CLIENT}`,
  port: +`${process.env.SMTP_PORT}`,
  secure: false,
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false
  },
  logger: true,
  debug: false // include SMTP traffic in the logs
});

export const VideoLibraryResolver = {
  Query: {
    getVideo(root: any, { _id }: any, ctx: any) {
      return VideoLibrary.findById(_id);
    },
    getVideosBy(root: any, { input }: any, ctx: any) {
      const cleanedInput = _.pick(input, ["title", "description", "views", "fileID", "_id"]);
      return VideoLibrary.find(cleanedInput);
    },
    listVideos(root: any, args: any, ctx: any) {
      return VideoLibrary.find().then( async videos => {
        const userResponse = await VideoLibraryHelper.getMultipleUserDetails(videos);
        const userMap = Object.values<any>(userResponse.data)
          .reduce((acc, user) => {
            if (user?.length > 0) {
              acc[user[0].rhatUUID] = user[0];
            }
            return acc;
          }, {});
        return videos.map(video => ({
          ...video.toObject(),
          createdBy: userMap[video.createdBy] || { rhatUUID: video.createdBy },
          updatedBy: userMap[video.updatedBy] || { rhatUUID: video.updatedBy },
        }));
      });
    },
  },
  Mutation: {
    addVideo(root: any, { input }: any, ctx: any) {
      return new VideoLibrary(input).save()
        .then(res => {
          return VideoLibrary.findById(res._id)
            .then(video => {
              if (!video) {
                throw new Error("An unexpected error has occured");
              }
              return video;
            });
        })
        .then(async video => {
          const query = `{
            getUsersBy(rhatUUID: "${video.createdBy}") {
              name
              rhatUUID
            }
          }`;
          const userDetails = await VideoLibraryHelper.fetchUserDetails(query)
          .then( res => res.data?.getUsersBy ? res.data.getUsersBy[0] : null );
          if (input.skipEmail !== true) {
            const cc = video.mailingLists.filter((email: any) => !!email && email !== process.env.EMAIL);
            transporter.sendMail({
              from: `${userDetails?.name} <${process.env.NOREPLY_EMAIL}>`,
              to: process.env.TO_EMAIL,
              cc: cc.join(", "),
              messageId: `${video._id}`,
              subject: `[Demo] ${video.title} (${VideoLibraryHelper.humanizeTime(video.length, { fallbackString: video.approxLength })})`,
              text: `Hello,

${userDetails?.name} has recently added a video to the One Portal Video Library.

Video Title: ${video.title}

Video Description:
\t${video.description || `A Demo was recently created for ${video.title} by ${userDetails?.name}.`}

Video Length: ${VideoLibraryHelper.humanizeTime(video.length, { fallbackString: video.approxLength })}
To watch this video on One Portal, follow this link: ${process.env.CLIENT}/video-library?videoID=${video.fileID || video._id}

Sent from One Portal: ${process.env.CLIENT}`,
            })
            .catch((err: any) => {
              console.log(`[Video Library] EmailError: ${new Date().toString()}\n`, err);
              throw err;
            });
          }

          return video;
        })
        .catch(err => {
          console.log(`[Video Library] VideoCreateError: ${new Date().toString()}\n`, err);
          throw err;
        });
    },
    updateVideo(root: any, { input }: any, ctx: any) {
      return VideoLibrary.findByIdAndUpdate(input._id, input, { new: true });
    },
    incrementVideoViewCount(root: any, { _id }: any, ctx: any) {
      return VideoLibrary.findByIdAndUpdate(_id, { $inc: { views: 1 }}, { new: true })
        .exec()
        .then(res => {
          if (!res) {
            throw new Error("Video Not Found");
          }
          return res.views;
        });
    },
    removeVideo(root: any, { _id }: any, ctx: any) {
      return VideoLibrary.findByIdAndRemove(_id).then(res => res);
    },
    /**
     * Initiates the import script for mailman
     */
    importVideosFromMailman(root: any, input: any, ctx: any) {
      new MailmanCron().getEmailArchives();
      return "Import Initiated...";
    }
  }  
}
