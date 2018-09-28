const {
  Group,
  UserGroup,
  User,
  Message,
} = require('../models');

async function getPageInfo({
  messages, groupId, before, after,
}) {
  if (messages.length === 0) {
    const isPrev = await Message.findOne({
      groupId,
      _id: { $lt: before || after },
    });
    const isNext = await Message.findOne({
      groupId,
      _id: { $gt: before || after },
    });

    return {
      hasPreviousPage: !!isPrev,
      hasNextPage: !!isNext,
    };
  }

  const isPrev = await Message.findOne({
    groupId,
    _id: {
      $lt: messages[0].id,
    },
  });
  const isNext = await Message.findOne({
    groupId,
    _id: {
      $gt: messages[messages.length - 1].id,
    },
  });

  return {
    hasPreviousPage: !!isPrev,
    hasNextPage: !!isNext,
  };
}

module.exports = {
  Group: {
    async users(parent) {
      const { id } = parent;
      const usersGroup = await UserGroup.find({ groupId: id });
      const users = await User.find({ _id: { $in: usersGroup.map(u => u.userId) } });

      return users;
    },
    async messages(parent, args) {
      const { id } = parent;
      const {
        first, last, before, after,
      } = args;
      // before - last, after - first

      let idCond;

      if (after) {
        idCond = {
          $gt: after,
        };
      }
      if (before) {
        idCond = {
          $lt: before,
        };
      }

      const where = {
        _id: idCond,
        groupId: id,
      };

      if (!idCond) {
        delete where._id;
      }

      const messages = await Message.find(where).limit(first || last);

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
  },
  Query: {
    groups: () => Group.find(),
    group: (parent, { id }) => Group.findById(id),
  },
  Mutation: {
    createGroup: async (parent, { group }, { user }) => {
      const created = await Group.create(group);

      await UserGroup.create({
        userId: user.id,
        groupId: created.id,
      });
      const { userIds } = group;

      if (Array.isArray(userIds) && userIds.length) {
        await UserGroup.insertMany(userIds.map(u => ({
          userId: u,
          groupId: created.id,
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

      return res.nModified;
    },
    deleteGroup: async (parent, { id }) => {
      const res = await Group.deleteOne({ _id: id });

      return res.n;
    },
    joinGroup: async (parent, { id }, { user }) => {
      const group = await Group.findById(id);

      if (!group) {
        return false;
      }

      try {
        await UserGroup.create({ userId: user.id, groupId: id });

        return true;
      } catch (err) {
        if (err.errmsg.indexOf('duplicate key error') > -1) {
          return false;
        }

        throw err;
      }
    },
    leaveGroup: async (parent, { id }, { user }) => {
      const res = await UserGroup.deleteOne({ userId: user.id, groupId: id });

      return res.n;
    },
    directMessage: async (parent, { id }, { user }) => {
      const dUser = await User.findById(id);

      if (!dUser) {
        throw new Error('no user found with such id');
      }
      const names = [user.email, dUser.email];

      console.log(names.sort());

      // try to create such group
      let group;

      try {
        group = await Group.create({
          name: names.join(', '),
          code: names.join(''),
        });
      } catch (err) {
        if (err.errmsg.indexOf('duplicate key error') > -1) {
          group = await Group.findOne({ code: names.join('') });
        }
      }

      try {
        await UserGroup.insertMany([{
          userId: user.id,
          groupId: group.id,
        }, {
          userId: dUser.id,
          groupId: group.id,
        }]);
      } catch (err) {
        if (err.errmsg.indexOf('duplicate key error')) {
          return group;
        }
      }

      return group;

    },
  },
};
