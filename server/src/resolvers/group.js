const moment = require('moment');
const {
  Group,
  UserGroup,
  User,
  Message,
} = require('../models');
const {
  getPageInfo, formWhere,
} = require('../services/chat');
const taskService = require('../services/task');

module.exports = {
  Group: {
    assignedTo(parent) {
      if (!parent.assignedTo) {
        return null;
      }

      return User.findById(parent.assignedTo);
    },
    async lastMessage({ id }) {
      return Message.findOne({ groupId: id }).sort({ _id: -1 });
    },
    async users(parent) {
      const { id } = parent;
      const usersGroup = await UserGroup.find({ groupId: id });
      const users = await User.find({ _id: { $in: usersGroup.map(u => u.userId) } });

      return users;
    },
    async messages(parent, { messageConnection }, { user }) {
      const { id } = parent;
      const group = await Group.findById(id);

      if (!group /* || group.code */) {
        throw new Error('no group found');
      }
      const {
        first, last, before, after,
      } = messageConnection || {};
      // before - last, after - first
      const where = formWhere({ id, before, after });

      let messages = await Message.find(where).limit(first || last).lean();
      const oldestCursor = await UserGroup.findOne({
        groupId: id,
        userId: {
          $ne: user.id,
        },
      }).sort({ lastReadCursor: 1 });

      messages = messages.map(m => ({
        ...m,
        id: m._id.toString(),
        isRead: oldestCursor && oldestCursor.lastReadCursor >= m._id,
      }));

      const pageInfo = await getPageInfo({
        messages, groupId: id, before, after,
      });

      return {
        pageInfo,
        edges: messages.map(m => ({
          node: m,
          cursor: m.id,
        })),
      };
    },
    async unreadCount({ id }, args, { user }) {
      const userGroup = await UserGroup.findOne({ groupId: id, userId: user.id });
      const { lastReadCursor } = userGroup || {};

      return Message.find({
        groupId: id,
        userId: {
          $ne: user.id,
        },
        _id: {
          $gt: lastReadCursor,
        },
      }).count();
    },
    endDate: ({ endDate }) => (endDate ? moment(endDate).format() : null),
  },
  Query: {
    groups: () => Group.find({ code: null }),
    group: (parent, { id }) => Group.findOne({ _id: id, code: null }),
  },
  Mutation: {
    createGroup(parent, { group: task }, ctx) {
      return taskService.createTask(parent, { task }, ctx);
    },
    updateGroup(parent, { id, group: task }) {
      return taskService.updateTask(parent, { id, task });
    },
    deleteGroup(parent, { id }) {
      return taskService.deleteTask(parent, { id });
    },
    updateUsersGroup(parent, { group }) {
      return taskService.updateUsersGroup(parent, { group });
    },
  },
};
