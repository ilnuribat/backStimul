const models = require('./data/models');
const connectDB = require('./connectDB');

/* eslint-disable */
async function cleanUserGroups() {
  await connectDB();
  const cursor = await models.UserGroup.findOne().cursor();
  let userGroup = await cursor.next();

  while (userGroup) {    
    const group = await models.Group.findById(userGroup.groupId);
    
    if (!group) {
      console.log('usergroup to delete');
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
      console.log('init lastReadCursor');
      const lastMessage = await models.Message.findOne({ groupId: userGroup.groupId }).sort({ _id: -1 });

      if (!lastMessage) {
        userGroup = await cursor.next();
        continue;
      }

      console.log(lastMessage);
      await models.UserGroup.update({ _id: userGroup._id }, {
        $set: { lastReadCursor: lastMessage._id }
      });
    }

    userGroup = await cursor.next();
  }

  cursor.close();

  process.exit(0);
}

updateLastCursor();
