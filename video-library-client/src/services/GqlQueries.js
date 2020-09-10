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

export const incrementViewCount = /* GraphQL */ `
  mutation incrementViewCount($id: ID!) {
    incrementViewCount(_id: $id)
  }
`;

export const listVideos = /* GraphQL */ `
  query ListVideos {
    listVideos {
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
      createdBy
      updatedOn
      updatedBy
    }
  }
`;
