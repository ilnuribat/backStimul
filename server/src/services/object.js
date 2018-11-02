const { Group } = require('../models');

async function rootObjectQuery(parent, { id: addressId }) {
  if (!addressId) {
    // вывести корень. потом рассчитаем кратчайший путь
    const addresses = await Group.getGroupedLevel();

    return { addresses };
  }
  const rootObject = await Group.getFiasIdLevel(addressId);

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

module.exports = {
  rootObjectQuery,
};
