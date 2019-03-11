const { Notify, UserGroup, Message } = require('../models');
const { pubsub, NOTIFICATION_CREATED } = require('../services/constants');

const docCreate = async (data, Type) => {
  const Noty = data;
  const usersIds = [];

  Noty.updatedAt = new Date();
  Noty.createdAt = new Date();
  Noty.lastMessage = (await Message.findOne({ groupId: Noty.entityId })) || {};

  Noty.usersId = [];
  await UserGroup.find({ groupId: Noty.entityId }, 'userId -_id', (err, docs) => {
    docs.forEach((element) => { if (element.userId) usersIds.push(element.userId.toString()); });

    return docs;
  });
  Noty.usersId = usersIds;
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
  const usersIds = [];

  await UserGroup.find({ groupId: Noty.entityId }, 'userId -_id', (err, docs) => {
    docs.forEach((element) => { if (element.userId) usersIds.push(element.userId.toString()); });

    return docs;
  });

  doc.usersId = usersIds;
  doc.name = data.name;
  doc.updatedAt = new Date();
  // doc.lastMessage = data.lastMessage;
  let events = [...data.events, ...doc.events];

  doc.lastMessage = (await Message.findOne({ groupId: Noty.entityId })) || {};

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

