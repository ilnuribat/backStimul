const { assert } = require('chai');
const { Group } = require('../src/models');

describe('object', () => {
  before(async function () {
    this.area = await Group.create({
      type: 'AREA',
      name: 'test',
    });
    this.object = await Group.create({
      type: 'OBJECT',
      name: 'test',
      areaId: this.area._id,
    });
  });
  after(async function () {
    await Group.deleteMany({
      _id: {
        $in: [
          this.objectId, // create object test
          this.area._id,
          this.object._id,
        ],
      },
    });
    await Group.deleteMany({
      objectId: this.objectId,
    });
  });
  it('create', async function () {
    const { data, errors } = await this.request({
      query: `
      mutation {
        object {
          create(object: {
            name: "test"
            areaId: "${this.area._id.toString()}"
            constructionTypeId: 1
            address: {
              center: ["lat", "lon"]
            }
          }) {
            id
            name
          }
        }
      }
    `,
    });

    assert.isUndefined(errors, JSON.stringify(errors));
    assert.equal(data.object.create.name, 'test');

    const object = await Group.findById(data.object.create.id);

    assert.isObject(object);
    assert.equal(object.name, 'test');
    assert.equal(object.areaId.toString(), this.area._id.toString());

    this.objectId = object._id;
  });
  it('update', async function () {
    const { data, errors } = await this.request({
      query: `
      mutation {
        object(id: "${this.object._id.toString()}") {
          update(object: { name: "test1" })
        }
      }
      `,
    });
    const object = await Group.findById(this.object._id);

    assert.isUndefined(errors);
    assert.isTrue(data.object.update);
    assert.equal(object.name, 'test1');
  });
});
