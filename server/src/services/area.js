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

module.exports = {
  searchAreas,
};
