const axios = require('axios');
const Knex = require('knex');
const {
  PG_FIAS,
  DADATA_API,
  DADATA_SECRET,
} = require('../../config');
const { logger } = require('../../logger');
const { ADDRESS_LEVELS } = require('../resolvers/chat');

const knex = Knex({
  client: 'pg',
  connection: PG_FIAS,
});

async function getParentChain(fiasId) {
  let { rows } = await knex.raw(`
    SELECT 
      rtf_aoguid as "fiasId",
      rtf_shorttypename as type,
      rtf_addressobjectname as name
    FROM fstf_AddressObjects_AddressObjectTree('${fiasId}')
    ORDER BY rtf_AOLevel;
  `);

  let parent = null;


  rows = rows.map((r) => {
    Object.assign(r, { parentId: parent });
    parent = r.fiasId;

    return {
      parentId: r.parentId,
      type: r.type,
      fiasId: r.fiasId,
      name: r.name,
    };
  });

  return rows.filter(r => r.fiasId !== null);
}


async function formAddress(rawAddress) {
  logger.info('---------- make paid api request to dadata.ru ------------');

  const { data } = await axios(
    'https://dadata.ru/api/v2/clean/address',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Token ${DADATA_API}`,
        'X-Secret': DADATA_SECRET,
      },
      data: [rawAddress],
    },
  );

  // writeFileSync(rawAddress, JSON.stringify(data));
  // const data = JSON.parse(readFileSync(rawAddress, { encoding: 'utf-8' }));

  const [address] = data;


  const result = {
    value: address.result,
    coordinates: [address.geo_lat, address.geo_lon],
    fiasId: address.fias_id,
    fiasLevel: address.fias_level,
    geoLat: address.geo_lat,
    geoLon: address.geo_lon,
  };

  const levels = ADDRESS_LEVELS;

  levels.forEach((l) => {
    result[l] = {
      name: address[`${l}`],
      fiasId: address[`${l}_fias_id`],
      type: address[`${l}_type`],
      full: address[`${l}_with_type`],
    };
  });

  const fiasId = result.house.fiasId ? result.street.fiasId : result.fiasId;

  result.parentChain = await getParentChain(fiasId);

  if (!result.parentChain.length) {
    throw new Error('no address set');
  }

  return result;
}


module.exports = {
  formAddress,
};
