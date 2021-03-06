declare module '*.graphql';
declare module '*.json';
declare module 'node-fetch';
declare module 'request';

// define your types here
type Video = {
  title: string;
  description: string;
  views: number;
  videoURL: string;
  fileID: string;
  source: string;
  length: number;
  approxLength: string;
  categories: string[];
  mailingLists: string[];
  tags: string[];
  createdBy: string;
  createdOn: Date;
  updatedBy: string;
  updatedOn: Date;
}
