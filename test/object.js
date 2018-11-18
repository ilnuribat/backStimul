const { assert } = require('chai');
const { Group } = require('../server/src/models');

const query = (name, address) => `
  mutation {
    createObject(object: {
      name: "${name}"
      address: "${address}"
    }) {
      id
      name
      address {
        coordinates
      }
    }
  }
`;

describe.skip('object', () => {
  after(async function () {
    await Group.deleteOne({ _id: this.objectId });
  });
  it('create', async function () {
    const { data, errors } = await this.request({
      query: query('test', 'г Москва, ул Бакунинская, д 17/28'),
    });

    assert.isUndefined(errors);

    const object = await Group.findById(data.createObject.id);

    assert.isObject(object);
    assert.equal(object.name, 'test');
    assert.equal(object.address.value, 'г Москва, ул Бакунинская, д 17/28');

    this.objectId = object.id;
  });
});
