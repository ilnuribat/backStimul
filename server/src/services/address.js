const { readFileSync, writeFileSync } = require('fs');
const Knex = require('knex');
const axios = require('axios');
const {
  PG_FIAS,
  DADATA_API,
  DADATA_SECRET,
} = require('../../config');
const { logger } = require('../../logger');
const { ADDRESS_LEVELS } = require('../resolvers/chat');
const { Group } = require('../models');

const knex = Knex({
  client: 'pg',
  connection: PG_FIAS,
  // debug: true,
});

async function getParentChain(fiasId) {
  const res = await knex.raw(`
    SELECT rtf_aoguid as fias_id, rtf_shorttypename as type
    FROM fstf_AddressObjects_AddressObjectTree('${fiasId}')
    ORDER BY rtf_AOLevel;
  `);

  return res.rows;
}


async function formAddress(rawAddress) {
  // logger.info('---------- make paid api request to dadata.ru ------------');

  // const { data } = await axios(
  //   'https://dadata.ru/api/v2/clean/address',
  //   {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Accept: 'application/json',
  //       Authorization: `Token ${DADATA_API}`,
  //       'X-Secret': DADATA_SECRET,
  //     },
  //     data: [rawAddress],
  //   },
  // );

  // writeFileSync(rawAddress, JSON.stringify(data));
  const data = JSON.parse(readFileSync(rawAddress, { encoding: 'utf-8' }));

  const [address] = data;


  const result = {
    value: address.result,
    coordinates: [address.geo_lat, address.geo_lon],
    fias_id: address.fias_id,
    fias_level: address.fias_level,
    geoLat: address.geo_lat,
    geoLon: address.geo_lon,
  };

  const levels = ADDRESS_LEVELS;

  levels.forEach((l) => {
    result[l] = {
      name: address[`${l}`],
      fias_id: address[`${l}_fias_id`],
      type: address[`${l}_type`],
      full: address[`${l}_with_type`],
    };
  });

  const fiasId = result.house.fias_id ? result.street.fias_id : result.fias_id;

  result.parentChain = await getParentChain(fiasId);

  // console.log(result);

  return result;
}

async function test() {
  const addresses = await Promise.all([
    formAddress('Москва, ул Бакунинская'),
    formAddress('Миякинский район, каран кункас, ул Победы'),
    formAddress('Уфа, ул Кольцевая'),
    formAddress('Респ Башкортостан, г Баймак, ул А.Алибаева'),
    formAddress('Респ Башкортостан, г Сибай, ул Айсувака'),
  ]);

  console.log(addresses[0]);

  // await Group.insertMany(addresses.map(a => ({
  //   name: 'group',
  //   address: a,
  // })));
}

/*
db.getCollection('groups').aggregate([{
//     $match: {
//         _id: {
//             $ne: ObjectId('5bd8b2e22a651e44cfcf09ae')
//         }
//     }
// }, {
    $project: {
        address: 1,
        chain: {
            $arrayElemAt: ['$address.parentChain', 0]
        }
    }
}, {
    $group: {
        _id: '$chain.fias_id'
    }
}, {
    $group: {
        _id: 1,
        sum: {
            $sum: 1
        }
    }
}])
*/

test();

module.exports = {
  getParentChain,
  formAddress,
};
