const models = require('../src/models');
const { connect } = require('../connectDB');

/* eslint-disable */
async function cleanUserGroups() {
  await connect();
  const cursor = await models.UserGroup.findOne().cursor();
  let userGroup = await cursor.next();

  while (userGroup) {    
    const group = await models.Group.findById(userGroup.groupId);
    
    if (!group) {
      await models.UserGroup.deleteOne({ _id: userGroup._id });
    }
    userGroup = await cursor.next();
  }

  cursor.close();

  process.exit(0);
}

async function updateLastCursor() {
  await connect();
  const cursor = await models.UserGroup.findOne().cursor();
  let userGroup = await cursor.next();

  while (userGroup) {
    if (!userGroup.lastReadCursor) {
      const lastMessage = await models.Message.findOne({ groupId: userGroup.groupId }).sort({ _id: -1 });

      if (!lastMessage) {
        userGroup = await cursor.next();
        continue;
      }

      await models.UserGroup.updateOne({ _id: userGroup._id }, {
        $set: { lastReadCursor: lastMessage._id }
      });
    }

    userGroup = await cursor.next();
  }

  cursor.close();

  process.exit(0);
}

async function setObjectId() {
  await connect();
  const groups = await models.Group.find({
    // code: {
    //   $ne: null,
    // },
    // _id: '5c0508b1467da12e5fb19e06',
    type: 'TASK',
  }).lean();

  console.log(groups);
  const res = await Promise.all(groups.map((g) => {
    return models.Message.updateMany({
      groupId: g._id,
    }, {
      $set: {
        objectId: g.objectId,
      },
    });
  }));

  console.log(res);
}

async function areaObject() {
  await connect();

  const cursor = await models.Group.findOne({ type: 'OBJECT' }).cursor();
  let object = await cursor.next();

  while (object) {
    if (object.areaId) {
      console.log('skip this!');
      object = await cursor.next();

      continue;
    }

    const area = await models.Group.create({
      name: object.name,
      address: object.address,
      type: 'AREA',
    });

    await models.Group.updateOne({
      _id: object._id,
    }, {
      $set: {
        areaId: area._id,
      }
    });

    object = await cursor.next();
  }
}

async function userInitials() {
  await connect();

  const cursor = await models.User.findOne().cursor();
  let user = await cursor.next();

  while (user) {
    const { firstName, lastName, middleName } = user;

    console.log(user);

    await models.User.updateOne({
      _id: user._id,
    }, {
      $set: {
        initials: `${lastName} ${firstName[0]}.${middleName[0]}.`,
        fullName: `${lastName} ${firstName} ${middleName}`,
      },
    });

    user = await cursor.next();

    // break;
  }

}

// userInitials();