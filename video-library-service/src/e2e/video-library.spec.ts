import dotenv from 'dotenv';
/* Mock */
import mock from './mock.json';
import path from 'path';

import VideoLibrary from '../../service';

/* Supertest */
import supertest from 'supertest';

let request: supertest.SuperTest<supertest.Test>;
const query = `
  fragment VideoFragment on VideoType {
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
    owner{
      uid
      name
    }
    createdAt
    createdBy{
      uid
      name
    }
    modifiedAt
    modifiedBy{
      uid
      name
    }
  }

  query listVideos {
    listVideos {
      ...VideoFragment
    }
  }
  query getVideo($id: String!) {
    getVideo(_id: $id) {
      ...VideoFragment
    }
  }
  query getVideosBy($input: VideoInput!) {
    getVideosBy(input: $input) {
      ...VideoFragment
    }
  }
  mutation addVideo($input: VideoInput!) {
    addVideo(input: $input) {
      ...VideoFragment
    }
  }
  mutation updateVideo($input: VideoInput!) {
    updateVideo(input: $input) {
      ...VideoFragment
    }
  }
  mutation removeVideo($id: String!) {
    removeVideo(_id: $id) {
      ...VideoFragment
    }
  }
  mutation incrementViewCount($id: ID!) {
    incrementViewCount(_id: $id)
  }

`;

beforeAll(() => {
  request = supertest.agent(VideoLibrary);
});
afterAll(done => {
  return VideoLibrary.close(done);
});

describe('VideoLibrary microservice API Test', () => {
  it('AddVideo should create a video', done => {
    request
      .post('/graphql')
      .send({
        query: query,
        operationName: 'addVideo',
        variables: {
          input: mock
        }
      })
      .expect(res => {
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('data');

        expect(res.body.data).toHaveProperty('addVideo');
        expect(res.body.data.addVideo).toMatchObject(mock);
      })
      .end((err, res) => {
        done(err);
      });
  });

  it('ListVideos should return all videos', done => {
    request
      .post('/graphql')
      .send({
        query: query,
        operationName: 'listVideos'
      })
      .expect(res => {
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('data');
        
        expect(res.body.data.listVideos[0]).toMatchObject(mock);
      })
      .end((err, res) => {
        done(err);
      });
  });

  it('GetVideo should return a single matched video', done => {
    request
      .post('/graphql')
      .send({
        query: query,
        operationName: 'getVideo',
        variables: { id: "5d2f8df499410e01d3da3d62" }
      })
      .expect(res => {
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('data');

        expect(res.body.data.getVideo).toMatchObject(mock);
      })
      .end((err, res) => {
        done(err);
      });
  });

  it('GetVideosBy should return a list of matched video', done => {
    request
      .post('/graphql')
      .send({
        query: query,
        operationName: 'getVideosBy',
        variables: { input: {title: "Title of the video" }}
      })
      .expect(res => {
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('data');

        expect(res.body.data.getVideosBy[0]).toMatchObject(mock);
      })
      .end((err, res) => {
        done(err);
      });
  });

  it('UpdateVideo should update a video', done => {
    request
      .post('/graphql')
      .send({
        query: query,
        operationName: 'updateVideo',
        variables: {
          input: mock
        }
      })
      .expect(res => {
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('data');

        expect(res.body.data).toHaveProperty('updateVideo');
        expect(res.body.data.updateVideo).toMatchObject(mock);
      })
      .end((err, res) => {
        done(err);
      });
  });

  
  it('IncrementView should increment views of a video', done => {
    request
      .post('/graphql')
      .send({
        query: query,
        operationName: 'incrementViewCount',
        variables: { id: "5d2f8df499410e01d3da3d62" }
      })
      .expect(res => {
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('data');

        expect(res.body.data).toHaveProperty('incrementViewCount');
      })
      .end((err, res) => {
        done(err);
      });
  });


  it('Delete should delete a video', done => {
    request
      .post('/graphql')
      .send({
        query: query,
        operationName: 'removeVideo',
        variables: { id: "5d2f8df499410e01d3da3d62" }
      })
      .expect(res => {
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('data');

        expect(res.body.data).toHaveProperty('removeVideo');
        expect( res.body.data.removeVideo ).toHaveProperty( '_id' );
        expect( res.body.data.removeVideo ).toHaveProperty( 'title' );
        expect( res.body.data.removeVideo ).toHaveProperty( 'description' );
        expect( res.body.data.removeVideo ).toHaveProperty( 'videoURL' );
        expect( res.body.data.removeVideo ).toHaveProperty( 'fileID' );
        expect( res.body.data.removeVideo ).toHaveProperty( 'source' );
        expect( res.body.data.removeVideo ).toHaveProperty( 'length' );
        expect( res.body.data.removeVideo ).toHaveProperty( 'approxLength' );
        expect( res.body.data.removeVideo ).toHaveProperty( 'categories' );
        expect( res.body.data.removeVideo ).toHaveProperty( 'mailingLists' );
        expect( res.body.data.removeVideo ).toHaveProperty( 'tags' );
        expect( res.body.data.removeVideo ).toHaveProperty( 'owner' );
        expect( res.body.data.removeVideo ).toHaveProperty( 'createdAt' );
        expect( res.body.data.removeVideo ).toHaveProperty( 'createdBy' );
        expect( res.body.data.removeVideo ).toHaveProperty( 'modifiedAt' );
        expect( res.body.data.removeVideo ).toHaveProperty( 'modifiedBy' );
      })
      .end((err, res) => {
        done(err);
      });
  });

});
