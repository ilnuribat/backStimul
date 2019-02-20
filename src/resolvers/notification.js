const { withFilter } = require('apollo-server');
const moment = require('moment');
const { Group, Notification } = require('../models');
const { pubsub, NOTIFICATION_CREATED } = require('../services/constants');

module.exports = {
  NotificationConnection: {
    nodes: async ({ limit, offset }, args, { user }) => Notification.find({
      userId: {
        $ne: user._id,
      },
      watchers: {
        $elemMatch: {
          $eq: user._id,
        },
      },
    })
      .skip(offset)
      .limit(limit)
      .sort({ _id: -1 }),
    count: () => 1,
  },
  NotificationTargetUnion: {
    __resolveType: (parent) => {
      const map = {
        TASK: 'Task',
        OBJECT: 'Object',
        AREA: 'Area',
      };

      return map[parent.type];
    },
  },
  Notification: {
    id: parent => parent._id.toString(),
    isRead: (parent, args, { user }) => {
      if (!user.lastReadNotification) {
        return false;
      }

      return true;
    },
    target: parent => Group.findOne({
      type: parent.targetType,
      _id: parent.targetId,
    }),
    date: parent => moment(parent.createdAt).format(),
  },
  Subscription: {
    notificationCreated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([NOTIFICATION_CREATED]),
        ({ notificationCreated }, args, { user }) => notificationCreated.userId.toString() !== user._id.toString()
          && notificationCreated.watchers
            .map(_id => _id.toString())
            .includes(user._id.toString()),
      ),
    },
  },
};
