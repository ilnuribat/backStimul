const { Group, UserGroup } = require('../models');

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

async function searchObjects(user, regExp) {
  const res = await UserGroup.aggregate([{
    $match: {
      userId: user._id,
    },
  }, {
    $graphLookup: {
      from: 'groups',
      startWith: '$groupId',
      connectFromField: '_id',
      connectToField: '_id',
      as: 'objects',
      restrictSearchWithMatch: {
        type: 'OBJECT',
      },
    },
  }, {
    $unwind: '$objects',
  }, {
    $match: {
      $or: [{
        'objects.name': regExp,
      }, {
        'objects.address.value': regExp,
      }],
    },
  }]);

  return res.map(r => r.objects);
}

module.exports = {
  rootObjectQuery,
  searchObjects,
};
