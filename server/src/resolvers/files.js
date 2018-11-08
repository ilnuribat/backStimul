const { connection, Types: { ObjectId }, mongo: { GridFSBucket } } = require('mongoose');
const {
  Files,
} = require('../models');
// const { GraphQLUpload } = require('apollo-server');
const fs = require('fs');

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


const fileUpload = async (taskId, fileId) => {
  try {
    await Files.create({
      taskId,
      fileId,
    });
  } catch (err) {
    if (err.errmsg && err.errmsg.indexOf('duplicate key error') > -1) {
      await Files.findOne({ fileId });
    }
  }
};

const storeUpload = ({ stream, filename, id }) => {
  const bucket = new GridFSBucket(connection.db, { bucketName: 'gridfsdownload' });
  const uploadStream = bucket.openUploadStream(filename);

  // download(ObjectId('5bdc50d4d1531833206a7ed0'));
  return new Promise((resolve, reject) => stream
    .pipe(uploadStream)
    .on('finish', () => {
      console.log('fuinish');
      fileUpload(id, uploadStream.id);

      return uploadStream.id;
    })
    .on('error', reject));
};

module.exports = {
  Query: {
    findFiles: async (parent, { id }) => {
      const file = await Files.find({ taskId: id });

      const file = Files.aggregate([
        {$match: { taskId: "5be2d0efe7c10e6642ec1662" }},
        {$addFields: {fileIdObject: {"$toObjectId": "$fileId"}}},
        {$lookup:
          {from: 'gridfsdownload.files',
            localField: 'fileIdObject',
            foreignField: '_id',
            as: 'ururu'
          }
        }]);


      // .exec((er, doc) => {
      //   console.log(doc);
      //   return doc;
      // });
      // console.log(ObjectId(file.fileId).toString(), "string");

      return file;
    },
  },
  // Upload: GraphQLUpload,
  Mutation: {
    async uploadFile(parent, { id, file }) {
      const { stream, filename, mimetype } = await file;
      const ida = await storeUpload({ stream, filename, id });

      // console.log("AAAAAAAAA")

      return { ida, filename, mimetype };
    },
  },
};
