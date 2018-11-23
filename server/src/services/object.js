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

  let objects;

  if (addressId) {
    objects = await Group.find({
      'address.fiasId': addressId,
    });
  }

  return {
    ...rootObject,
    addresses,
    objects,
  };
}

async function searchObjects(user, regExp, limit = 10) {
  const res = await Group.find({
    type: 'OBJECT',
    $or: [{
      name: regExp,
    }, {
      'address.value': regExp,
    }],
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


module.exports = {
  rootObjectQuery,
  searchObjects,
  deleteObject,
};
