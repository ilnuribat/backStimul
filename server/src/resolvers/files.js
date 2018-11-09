const fs = require('fs');
const filesize = require('filesize');
const { connection, mongo: { GridFSBucket } } = require('mongoose');
const {
  Files,
} = require('../models');
// const { GraphQLUpload } = require('apollo-server');

const download = async function (id) {
  const bucket = new GridFSBucket(connection.db, { bucketName: 'gridfsdownload' });
  // const CHUNKS_COLL = 'gridfsdownload.chunks';
  const FILES_COLL = 'gridfsdownload.files';
  const collection = connection.db.collection(FILES_COLL);
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


const fileUpload = async ({ taskId, fileId }) => Files.create({
  taskId,
  fileId,
});

const storeUpload = ({ stream, filename: name, taskId }) => {
  const bucket = new GridFSBucket(connection.db, { bucketName: 'gridfsdownload' });
  const uploadStream = bucket.openUploadStream(name);

  // download(ObjectId('5bdc50d4d1531833206a7ed0'));
  return new Promise((resolve, reject) => stream
    .pipe(uploadStream)
    .on('finish', async () => {
      await fileUpload({ taskId, fileId: uploadStream.id }).then;

      return resolve({
        id: uploadStream.id.toString(),
        name,
        size: filesize(uploadStream.length),
      });
    })
    .on('error', reject));
};

module.exports = {
  Task: {
    files: async ({ id }) => {
      const file = await Files.aggregate([{
        $match: {
          taskId: id,
        },
      }, {
        $addFields: {
          fileIdObject: {
            $toObjectId: '$fileId',
          },
        },
      }, {
        $lookup: {
          from: 'gridfsdownload.files',
          localField: 'fileIdObject',
          foreignField: '_id',
          as: 'fileBody',
        },
      }, {
        $unwind: {
          path: '$fileBody',
        },
      }]);

      return file;
    },
  },
  Mutation: {
    async uploadFile(parent, { id: taskId, file }) {
      const loadedFile = await file;
      const fileSaved = await storeUpload({ ...loadedFile, taskId });

      return fileSaved;
    },
  },
};
