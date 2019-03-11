const { Notify, UserGroup } = require('../models');
const { pubsub, NOTIFICATION_CREATED } = require('../services/constants');

const docCreate = async (data, Type) => {
  const Noty = data;

  Noty.updatedAt = new Date();
  Noty.createdAt = new Date();

  const usersIds = await UserGroup.find({ groupId: Noty.entityId, type: 'CHAT' });
  const users = [];

  usersIds.forEach(({ userId }) => {
    // ToDo: Видит ли пользователь свои же изменения
    // if (userId && userId.toString() !== Noty.userId.toString()) { users.push(userId); }
    if (userId) { users.push(userId); }
  });

  Noty.usersId = users;
  const NewDoc = new Type(Noty);

  return NewDoc.save((err, doc) => {
    if (err) {
      return 'err';
    }

    return doc;
  });
};

async function makeNotify(data) {
  const doc = await Notify.findOne({ parentId: data.parentId });

  if (!doc) {
    await docCreate(data, Notify);

    return true;
  }

  const Noty = data;
  const usersIds = await UserGroup.find({ groupId: Noty.entityId, type: 'CHAT' }, 'userId -_id');

  const users = [];

  usersIds.forEach(({ userId }) => {
    // if (userId && userId.toString() !== Noty.userId.toString()) { users.push(userId); }
    if (userId) { users.push(userId); }
  });

  doc.usersId = users;
  doc.name = data.name;
  doc.updatedAt = new Date();
  doc.lastMessage = data.lastMessage;
  let events = [...data.events, ...doc.events];

  events = events.sort((a, b) => {
    const aa = new Date(a.date);
    const bb = new Date(b.date);

    if (aa > bb) return -1;
    if (aa < bb) return 1;

    return 0;
  }).slice(0, 5);

  doc.events = [...events];
  const res = await doc.save();

  pubsub.publish(NOTIFICATION_CREATED, {
    notificationCreated: doc,
  });

  return res;
}

module.exports.makeNotify = makeNotify;

