const { connection, mongo: { GridFSBucket }, Types: { ObjectId } } = require('mongoose');
const { UserGroup } = require('../models');

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
  const res = await UserGroup.aggregate([{
    // TODO search in all tasks
    $match: {
      userId: ObjectId(user.id),
      // no type specified! it is search
    },
  }, {
    $lookup: {
      from: 'files',
      localField: 'groupId',
      foreignField: 'taskId',
      as: 'files',
    },
  }, {
    $unwind: '$files',
  }, {
    $lookup: {
      from: 'gridfs.files',
      localField: 'files.fileId',
      foreignField: '_id',
      as: 'gridFile',
    },
  }, {
    $unwind: '$gridFile',
  }, {
    $match: {
      'gridFile.filename': regExp,
    },
  }, {
    $project: {
      id: '$gridFile._id',
      name: '$gridFile.filename',
      size: '$gridFile.length',
      date: '$gridFile.uploadDate',
      mimeType: '$files.mimetype',
      groupId: '$groupId',
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
