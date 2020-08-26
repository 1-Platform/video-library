import { Document, Model, Schema, model } from "mongoose";
import VideoLibraryHelpers from "./helpers";

export const VideoSchema: Schema = new Schema({
  title: String,
  description: String,
  views: Number,
  videoURL: String,
  fileID: { type: String, default: "" },
  source: String,
  length: Number,
  approxLength: String,
  categories: [String],
  mailingLists: [String],
  tags: [String],
  owner: {
    UID: String,
    name: String
  },
  createdAt: { type: Date, default: Date.now },
  createdBy: {
    UID: String,
    name: String,
    email: String,
    location: String,
    title: String,
    isActive: Boolean
  },
  modifiedAt: Date,
  modifiedBy: {
    UID: String,
    name: String,
    email: String,
    location: String,
    title: String,
    isActive: Boolean
  }
}, { collection: "video-library" });

VideoSchema.post("save", (doc: VideoModel) => {
  return doc.updateOne({
    source: doc.source || VideoLibraryHelpers.getVideoSource(doc.videoURL),
    fileID: doc.fileID || VideoLibraryHelpers.getVideoFileID(doc.videoURL, doc._id),
  }).exec();
});

interface VideoModel extends Video, Document { }
interface VideoModelStatic extends Model<VideoModel> { }

export const VideoLibrary: Model<VideoModel> = model<VideoModel, VideoModelStatic>("VideoLibrary", VideoSchema);
