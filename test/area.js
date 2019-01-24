const { assert } = require('chai');
const { Group } = require('../src/models');
const { formAddress } = require('../src/services/address');

const addresses = [
  {
    raw: 'москва, бакунинская 17/28',
    formal: 'г Москва, ул Бакунинская, д 17/28',
  },
  {
    raw: 'миякинский район, Каран-кункас, ул победы',
  },
];

describe('area', () => {
  before(async function () {
    const address = await formAddress(addresses[1].raw);

    this.area = await Group.create({
      name: 'test',
      address,
    });
  });
  after(async function () {
    await Group.deleteMany({
      _id: {
        $in: [
          this.tmpArea.data.area.create.id,
          this.area._id,
        ],
      },
    });
  });
  it('create', async function () {
    this.tmpArea = await this.request({
      query: `
        mutation {
          area {
            create(area: {
              name: "test",
                address: {
                  value: "${addresses[0].raw}",
                  center: ["lat", "lon"]
                },
                SU: "test SU"
            }) {
              id
              name
              address {
                value
                coordinates
              }
            }
          }
        }
      `,
    });

    const { errors, data } = this.tmpArea;
    const area = await Group.findById(data.area.create.id);

    // response object checking
    assert.isUndefined(errors);
    assert.isObject(data.area.create);
    assert.equal(data.area.create.name, 'test');
    assert.equal(data.area.create.address.value, addresses[0].formal);

    // database object checking
    assert.isObject(area);
    assert.equal(area.name, 'test');
    assert.equal(area.address.value, addresses[0].formal);
  });
  it('update area name', async function () {
    const { data, errors } = await this.request({
      query: `
        mutation {
          area(id: "${this.area._id.toString()}") {
            update(area: { name: "test1" })
          }
        }
      `,
    });
    const area = await Group.findById(this.area._id);

    assert.isUndefined(errors);
    assert.isTrue(data.area.update);

    assert.equal(area.name, 'test1');
  });
  it('delete', async function () {
    const { data, errors } = await this.request({
      query: `
        mutation {
          area(id: "${this.area._id.toString()}") {
            delete
          }
        }
      `,
    });

    assert.isUndefined(errors);
    assert.isTrue(data.area.delete);

    const area = await Group.findById(this.area._id);

    assert.isNull(area);
  });
});
