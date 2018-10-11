const { Types: { ObjectId } } = require('mongoose');
const moment = require('moment');
const { withFilter } = require('apollo-server');
const {
  Group,
  UserGroup,
  User,
  Message,
} = require('../models');
const {
  getPageInfo, formWhere, pubsub, TASK_UPDATED,
} = require('./chat');


module.exports = {
  Group: {
    assignedTo(group) {
      return group.assignedTo ? group.assignedTo.toString() : null;
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
    createGroup: async (parent, { group }, { user }) => {
      const created = await Group.create(group);

      await UserGroup.create({
        userId: user.id,
        groupId: created.id,
        lastReadCursor: ObjectId.createFromTime(0),
      });

      const { userIds } = group;

      if (Array.isArray(userIds) && userIds.length) {
        await UserGroup.insertMany(userIds.map(u => ({
          userId: u,
          groupId: created.id,
          lastReadCursor: ObjectId.createFromTime(0),
        })));
      }

      return created;
    },
    updateGroup: async (parent, { id, group }) => {
      const groupId = id || group.id;
      const foundGroup = await Group.findById(groupId);

      if (!foundGroup) {
        return false;
      }

      const res = await foundGroup.update(group);

      if (res.nModified) {
        const updatedGroup = await Group.findById(groupId);

        pubsub.publish(TASK_UPDATED, { taskUpdated: updatedGroup });
      }

      return res.nModified;
    },
    deleteGroup: async (parent, { id }) => {
      const res = await Group.deleteOne({ _id: id });

      return res.n;
    },
    updateUsersGroup: async (parent, { group }) => {
      const groupId = group.id;
      const foundGroup = await Group.findById(groupId);

      if (!foundGroup) {
        return false;
      }

      const { users } = group;
      const lastMessage = await Message.findOne({ groupId });

      if (!group.delete && Array.isArray(users) && users.length) {
        try {
          await UserGroup.insertMany(users.map(u => ({
            userId: u,
            groupId: foundGroup.id,
            lastReadCursor: lastMessage ? lastMessage._id : ObjectId.createFromTime(0),
          })));

          return true;
        } catch (err) {
          return false;
        }
      }

      if (group.delete && Array.isArray(users) && users.length) {
        const res = await UserGroup.deleteMany({ userId: { $in: users }, groupId: foundGroup.id });

        return !!res.n;
      }

      return false;
    },
    directMessage: async (parent, { id }, { user }) => {
      const dUser = await User.findById(id);

      if (!dUser) {
        throw new Error('no user found with such id');
      }
      const ids = [user.id, dUser.id].sort();

      // try to create such group
      let group;

      try {
        group = await Group.create({
          name: ids.join(', '),
          code: ids.join('|'),
        });
      } catch (err) {
        if (err.errmsg && err.errmsg.indexOf('duplicate key error') > -1) {
          group = await Group.findOne({ code: ids.join('|') });
        }
      }

      try {
        await UserGroup.insertMany([{
          userId: user.id,
          groupId: group.id,
          lastReadCursor: ObjectId.createFromTime(0),
        }, {
          userId: dUser.id,
          groupId: group.id,
          lastReadCursor: ObjectId.createFromTime(0),
        }]);
      } catch (err) {
        if (err.errmsg && err.errmsg.indexOf('duplicate key error')) {
          return group;
        }
      }

      return group;
    },
  },
  Subscription: {
    taskUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([TASK_UPDATED]),
        ({ taskUpdated: { _id: mId } }, { id }) => mId.toString() === id,
      ),
    },
  },
};
