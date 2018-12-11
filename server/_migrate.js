const models = require('./src/models');
const connectDB = require('./connectDB');

/* eslint-disable */
async function cleanUserGroups() {
  await connectDB();
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
  await connectDB();
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
  await connectDB();
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

// updateLastCursor();
setObjectId();
