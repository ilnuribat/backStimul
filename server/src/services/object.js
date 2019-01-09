const { Group } = require('../models');

const uuidRegEx = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;

async function rootObjectQuery(parent, { id: addressId }) {
  if (!addressId || !uuidRegEx.test(addressId)) {
    // вывести корень. потом рассчитаем кратчайший путь
    const addresses = await Group.getGroupedLevel();

    return { addresses };
  }
  const rootObject = await Group.getFiasIdLevel(addressId);

  if (!rootObject) {
    throw new Error('no such address');
  }

  const addresses = await Group.getGroupedLevel(rootObject.level + 1, rootObject.id);

  let areas;

  if (addressId) {
    areas = await Group.find({
      type: 'AREA',
      'address.fiasId': addressId,
    });
  }

  const crumbs = await Group.getParentChain(addressId, rootObject.level);

  return {
    ...rootObject,
    addresses,
    areas,
    crumbs,
  };
}

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
    name: object.name,
    areaId: object.areaId,
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
  rootObjectQuery,
  searchObjects,
  deleteObject,
  createObject,
  updateObject,
};
