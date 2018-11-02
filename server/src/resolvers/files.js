const { connection, Types: { ObjectId }, mongo: { GridFSBucket } } = require('mongoose');
// const { GraphQLUpload } = require('apollo-server');
const fs = require('fs');

const download = async function (callback) {
  const bucket = new GridFSBucket(connection.db, { bucketName: 'gridfsdownload' });
  // const CHUNKS_COLL = 'gridfsdownload.chunks';
  const FILES_COLL = 'gridfsdownload.files';

  const collection = connection.db.collection(FILES_COLL);

  const id = ObjectId('5bdc50d4d1531833206a7ed0');

  const chunksQuery = await collection.findOne(id);

  // bucket.openDownloadStreamByName('blanks.pdf').
  bucket.openDownloadStream(id)
    .pipe(fs.createWriteStream(chunksQuery.filename))
    .on('error', (error) => {
      console.log(error);
    })
    .on('finish', () => {
      // console.log('done!');
    });
};


const storeUpload = ({ stream, filename }) => {
  const bucket = new GridFSBucket(connection.db, { bucketName: 'gridfsdownload' });
  const uploadStream = bucket.openUploadStream(filename);

  download();

  return new Promise((resolve, reject) => stream
    .pipe(uploadStream)
    .on('finish', () => uploadStream.id)
    .on('error', reject));
};

module.exports = {
  // Upload: GraphQLUpload,
  Mutation: {
    async uploadFile(parent, { file }) {
      const { stream, filename, mimetype } = await file;

      const id = await storeUpload({ stream, filename, mimetype });

      return { id, filename, mimetype };
    },
  },
};
