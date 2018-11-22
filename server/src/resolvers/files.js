
const filesize = require('filesize');
const { GraphQLUpload } = require('apollo-upload-server');
const { connection, mongo: { GridFSBucket } } = require('mongoose');
const {
  Files,
} = require('../models');

const fileUpload = async ({ taskId, fileId, mimetype }) => Files.create({
  taskId,
  fileId,
  mimetype,
});

const storeUpload = ({
  stream,
  filename: name,
  taskId,
  mimetype,
}) => {
  const bucket = new GridFSBucket(connection.db, { bucketName: 'gridfs' });
  const uploadStream = bucket.openUploadStream(name);

  return new Promise((resolve, reject) => stream
    .pipe(uploadStream)
    .on('finish', async () => {
      await fileUpload({ taskId, fileId: uploadStream.id, mimetype }).then;

      return resolve({
        id: uploadStream.id.toString(),
        name,
        mimeType: mimetype,
        size: filesize(uploadStream.length),
      });
    })
    .on('error', reject));
};

module.exports = {
  Upload: GraphQLUpload,
  Task: {
    files: async ({ id }) => {
      const file = await Files.aggregate([{
        $match: {
          taskId: id,
        },
      }, {
        $project: {
          _id: 0,
          fileId: 1,
          mimetype: 1,
        },
      }, {
        $addFields: {
          fileIdObject: {
            $toObjectId: '$fileId',
          },
        },
      }, {
        $lookup: {
          from: 'gridfs.files',
          localField: 'fileIdObject',
          foreignField: '_id',
          as: 'fileBody',
        },
      }, {
        $unwind: {
          path: '$fileBody',
        },
      }, {
        $addFields: {
          id: '$fileId',
          size: '$fileBody.length',
          name: '$fileBody.filename',
          date: {
            $toString: '$fileBody.uploadDate',
          },
          mimeType: '$mimetype',
        },
      }, {
        $project: {
          fileBody: 0,
          fileIdObject: 0,
          fileId: 0,
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
    async deleteFile(parent, { id }) {
      const res = await Files.deleteOne({ fileId: id });

      return res.n;
    },
  },
};
