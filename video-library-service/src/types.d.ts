declare module '*.graphql';
declare module '*.json';

// define your types here
type Video = {
  _id: any;
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
  owner: IUserProfile;
  createdAt: Date;
  createdBy: IUser;
  modifiedAt?: string;
  modifiedBy?: IUser;
}

type IUser = {
    uid: string;
    name?: string;
    email?: string;
    location?: string;
    title?: string;
    isActive?: Boolean;
  }

  type IUserProfile = {
    uid: string;
    name: string;
  }
