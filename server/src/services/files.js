const { connection, mongo: { GridFSBucket }, Types: { ObjectId } } = require('mongoose');

async function download(id) {
  if (!ObjectId.isValid(id)) {
    throw new Error('not valid object id');
  }
  const bucket = new GridFSBucket(connection.db, { bucketName: 'gridfsdownload' });
  // const CHUNKS_COLL = 'gridfsdownload.chunks';
  const FILES_COLL = 'gridfsdownload.files';
  const collection = connection.db.collection(FILES_COLL);
  const chunksQuery = await collection.findOne({ _id: ObjectId(id) });

  return {
    stream: bucket.openDownloadStream(ObjectId(id)),
    filename: chunksQuery.filename,
  };
  // .pipe(fs.createWriteStream(chunksQuery.filename))
  // .on('error', (error) => {
  //   console.log(error);
  // })
  // .on('finish', () => {
  //   // resolve(); console.log('done!');
  // });
}

module.exports = {
  download,
};
