const { Types: { ObjectId } } = require('mongoose');
const moment = require('moment');
const { withFilter } = require('apollo-server');
const axios = require('axios');
const {
  Group,
  UserGroup,
  User,
  Message,
} = require('../models');
const { logger } = require('../../logger');
const {
  getPageInfo, formWhere, pubsub, TASK_UPDATED, USER_TASK_UPDATED, TASK_STATUSES,
} = require('./chat');

async function formAddress(rawAddress) {
  logger.info('---------- make paid api request to dadata.ru ------------');

  const { data: [address] } = await axios(
    'https://dadata.ru/api/v2/clean/address',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Token a9a4c39341d2f4072db135bd25b751336b1abb83',
        'X-Secret': '53298fa2e7d1762e0e329388eb3fd66ae4a3312a',
      },
      data: [rawAddress],
    },
  );

  return {
    value: address.result,
    coordinates: [address.geo_lat, address.geo_lon],
    fias_id: address.fias_id,
    fias_level: address.fias_level,
    geoLat: address.geo_lat,
    geoLon: address.geo_lon,
  };
}

module.exports = {
  Group: {
    assignedTo(group) {
      if (!group.assignedTo) {
        return null;
      }

      return User.findById(group.assignedTo);
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
      let formedAddress;

      if (typeof group.address === 'string') {
        formedAddress = await formAddress(group.address);
      }

      const created = await Group.create(Object.assign({
        status: TASK_STATUSES[0].id,
        address: formedAddress,
      }, group));

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

      if (typeof group.address === 'string'
        && foundGroup.address
        && foundGroup.address.value !== group.address) {
        const address = await formAddress(group.address);

        Object.assign(group, { address });
      } else {
        Object.assign(group, { address: foundGroup.address });
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

      if (!Array.isArray(users) || !users.length) {
        return false;
      }

      const fullUsers = await User.find({
        _id: {
          $in: users,
        },
      });

      if (!group.delete) {
        try {
          const lastMessage = await Message.findOne({ groupId });

          await UserGroup.insertMany(users.map(u => ({
            userId: u,
            groupId: foundGroup.id,
            lastReadCursor: lastMessage ? lastMessage._id : ObjectId.createFromTime(0),
          })));

          fullUsers.map(u => pubsub.publish(USER_TASK_UPDATED, {
            userTaskUpdated: {
              user: {
                id: u.id,
                username: u.username,
                email: u.email,
              },
              action: 'INVITED',
            },
          }));

          return true;
        } catch (err) {
          return false;
        }
      }

      const res = await UserGroup.deleteMany({ userId: { $in: users }, groupId: foundGroup.id });

      fullUsers.map(u => pubsub.publish(USER_TASK_UPDATED, {
        userTaskUpdated: {
          user: {
            id: u.id,
            username: u.username,
            email: u.email,
          },
          action: 'KICKED',
        },
      }));

      return !!res.n;
    },
  },
  Subscription: {
    taskUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([TASK_UPDATED]),
        ({ taskUpdated: { _id: mId } }, { id }) => mId.toString() === id,
      ),
    },
    userTaskUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([USER_TASK_UPDATED]),
        () => true,
      ),
    },
  },
};
