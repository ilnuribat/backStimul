const { Group } = require('../models');

async function searchAreas(user, regExQuery, limit) {
  return Group.find({
    type: 'AREA',
    $or: [{
      name: regExQuery,
    }, {
      'address.value': regExQuery,
    }],
  }).limit(limit).lean();
}

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
    name: `${rootObject.type}. ${rootObject.name}`,
    addresses,
    areas,
    crumbs,
  };
}

function formCrumbs(area) {
  return area.address.parentChain;
}

module.exports = {
  searchAreas,
  rootObjectQuery,
  formCrumbs,
};
