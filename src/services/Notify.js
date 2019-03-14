const { Notify, UserGroup, User } = require('../models');
const { pubsub, NOTIFICATION_CREATED, STATUSES } = require('../services/constants');


const docCreate = async (data, Type) => {
  const Noty = data;

  Noty.updatedAt = new Date();
  Noty.createdAt = new Date();

  const usersIds = await UserGroup.find({ groupId: Noty.entityId, type: 'CHAT' }, 'userId -_id');
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

const doNotify = async (...data) => {
  const [parent, task, user, foundTask, some] = data;

  let id = parent && parent._id && parent._id.toString();

  if (!id) {
    id = foundTask && foundTask._id && foundTask._id.toString();
  }
  if (!id || !user || !user._id) {
    return false;
  }

  const dataForNotify = {};

  const fields = () => ({
    name: 'Название',
    status: 'Статус',
    assignedTo: 'Ответственный',
    endDate: 'Дата завершения',
    users: 'Список пользователей',
  });

  dataForNotify.groupId = id || null;
  dataForNotify.entityId = id || null;
  dataForNotify.notyId = id || null;
  dataForNotify.parentId = id || null;
  dataForNotify.userId = user._id || null;
  dataForNotify.name = foundTask.name || null;
  dataForNotify.events = [];

  const preStr = (p1, p2, p3) => {
    let str = `с "${p1 || 'Не указано'}" на "${p2 || 'Неизвестно'}"`;

    if (p3 === 'users') {
      str = `- ${p1 || 'изменил'} ${p2 || 'Неизвестно'}`;

      return str;
    }
    if (['status', 'assignedTo', 'name', 'endDate'].indexOf(p3) > -1) {
      return str;
    }

    return null;
  };

  Object.keys(task).forEach(async (element) => {
    let oldparam = foundTask[element];
    let newparam = task[element];

    if (element === 'assignedTo') {
      const oldu = await User.findById(oldparam, 'fullName initials -_id');
      const newu = await User.findById(newparam, 'fullName initials -_id');

      oldparam = oldu && oldu.initials && oldu.initials;
      newparam = newu && newu.initials && newu.initials;
    }
    if (element === 'users') {
      const userStatus = task.delete ? 'удалён' : 'добавлен';

      oldparam = userStatus;
      newparam = some.initials || some.fullName || null;
      if (!some && !some.initials) {
        newparam = await User.findById(newparam, 'fullName initials -_id');
        newparam = newparam.initials || newparam.fullName || null;
      }
    }
    if (element === 'status') {
      const statuses = STATUSES[parent.statusType] || STATUSES.STANDART;

      oldparam = oldparam || '1';
      newparam = newparam || '1';
      const oldi = statuses && statuses.find(x => x && x.id && x.id.toString() === oldparam && oldparam.toString());
      const newi = statuses && statuses.find(x => x && x.id && x.id.toString() === newparam && newparam.toString());

      oldparam = oldi && oldi.name && oldi.name;
      newparam = newi && newi.name && newi.name;
    }
    const str = preStr(oldparam || foundTask[element], newparam || task[element], element);

    if (!str) return null;
    // eslint-disable-next-line max-len
    dataForNotify.events.push({ date: new Date(), text: `${user.initials || user.fullName || user.email || 'неизвестный'} изменил ${fields()[element]} ${str}` });

    return true;
  });

  makeNotify(dataForNotify);

  return true;
};


module.exports.makeNotify = makeNotify;
module.exports.doNotify = doNotify;

