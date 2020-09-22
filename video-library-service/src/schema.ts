import { Document, Model, Schema, model } from "mongoose";
import VideoLibraryHelpers from "./helpers";

export const VideoSchema: Schema = new Schema({
  title: String,
  description: String,
  views: { type: Number, default: 0 },
  videoURL: String,
  fileID: { type: String, default: "" },
  source: String,
  length: Number,
  approxLength: String,
  categories: [String],
  mailingLists: [String],
  tags: [String],
  createdBy: String,
  createdOn: Date,
  updatedBy: String,
  updatedOn: Date
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
