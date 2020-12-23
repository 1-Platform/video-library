const videoType = /* GraphQL */ `
      _id
      title
      description
      views
      videoURL
      fileID
      source
      length
      approxLength
      categories
      mailingLists
      tags
      createdOn
      createdBy{
        name
        rhatUUID
      }
      updatedOn
      updatedBy{
        name
        rhatUUID
      }
`;

export const addVideo = /* GraphQL */ `
  mutation AddVideo($video: VideoInput!) {
    addVideo(input: $video) {
      title
      description
      videoURL
      approxLength
      mailingLists
    }
  }
`;

export const incrementVideoViewCount = /* GraphQL */ `
  mutation incrementVideoViewCount($id: ID!) {
    incrementVideoViewCount(_id: $id)
  }
`;

export const updateVideo = /* GraphQL */ `
  mutation updateVideo($video: VideoInput!) {
    updateVideo(input: $video) {
      ${videoType}
    }
  }
`;

export const listVideos = /* GraphQL */ `
  query ListVideos {
    listVideos {
      ${videoType}
    }
  }
`;
