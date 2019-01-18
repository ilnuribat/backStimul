const { Group } = require('../models');

async function searchObjects(user, regExp, limit) {
  const res = await Group.find({
    type: 'OBJECT',
    name: regExp,
  }).limit(limit).lean();

  return res;
}

async function deleteObject(parent, { id }) {
  const foundObject = await Group.findById(id);

  if (!foundObject) {
    throw new Error('no object found to delete');
  }

  await Group.deleteMany({
    type: 'TASK',
    objectId: foundObject._id,
  });

  const res = await Group.deleteOne({ _id: id });

  return res.n;
}

async function createObject(parent, { object }) {
  if (!object.areaId) {
    throw new Error('no areaId');
  }
  if (!object.name) {
    throw new Error('no name');
  }
  const res = await Group.create({
    ...object,
    type: 'OBJECT',
  });

  return res;
}

async function updateObject({ id }, { object }) {
  const res = await Group.updateOne({
    _id: id,
  }, {
    $set: object,
  });

  return res.nModified;
}


module.exports = {
  searchObjects,
  deleteObject,
  createObject,
  updateObject,
};
