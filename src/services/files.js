const { connection, mongo: { GridFSBucket }, Types: { ObjectId } } = require('mongoose');
const { Files } = require('../models');

async function download(id) {
  if (!ObjectId.isValid(id)) {
    throw new Error('not valid object id');
  }
  const bucket = new GridFSBucket(connection.db, { bucketName: 'gridfs' });
  // const CHUNKS_COLL = 'gridfs.chunks';
  const FILES_COLL = 'gridfs.files';
  const collection = connection.db.collection(FILES_COLL);
  const chunksQuery = await collection.findOne({ _id: ObjectId(id) });

  return {
    stream: bucket.openDownloadStream(ObjectId(id)),
    filename: chunksQuery.filename,
  };
}

async function searchFiles(user, regExp, limit) {
  const res = await Files.aggregate([{
    $lookup: {
      from: 'gridfs.files',
      localField: 'fileId',
      foreignField: '_id',
      as: 'gridfs',
    },
  }, {
    $unwind: '$gridfs',
  }, {
    $match: {
      'gridfs.filename': regExp,
    },
  }, {
    $project: {
      id: '$gridfs._id',
      name: '$gridfs.filename',
      size: '$gridfs.length',
      date: '$gridfs.uploadDate',
      mimeType: '$mimetype',
      groupId: '$taskId',
    },
  }, {
    $limit: limit,
  }]);

  return res;
}

module.exports = {
  download,
  searchFiles,
};
