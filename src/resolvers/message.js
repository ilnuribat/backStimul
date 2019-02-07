const { withFilter } = require('apollo-server');
const moment = require('moment');
const {
  Message, User, Group, UserGroup,
} = require('../models');
const {
  MESSAGE_READ, pubsub, MESSAGE_ADDED, ERROR_CODES,
} = require('../services/constants');
const { getUserInfoFromAD } = require('../services/ad');
const messageService = require('../services/message');


module.exports = {
  Message: {
    id: message => message._id.toString(),
    from: async (parent) => {
      const { userId } = parent;
      const user = await User.findById(userId).lean();

      if (user.email) {
        return getUserInfoFromAD(user);
      }

      return user;
    },
    to(parent) {
      const { groupId } = parent;

      return Group.findById(groupId);
    },
    createdAt: message => moment(message.createdAt).format(),
    userId: message => message.userId.toString(),
    groupId: message => message.groupId.toString(),
    objectId: message => message.objectId && message.objectId.toString(),
    isRead: async (message) => {
      if (message.isRead !== undefined) {
        return message.isRead;
      }

      const userGroups = await UserGroup.find({
        userId: {
          $ne: message.userId,
        },
        groupId: message.groupId,
      }).sort({ _id: 1 });

      const unReadMessages = userGroups.filter(ug => ug.lastReadCursor < message.id);

      return unReadMessages.length === 0;
    },
  },
  MessageMutation: {
    create: messageService.createMessage,
    read: messageService.messageRead,
  },
  Query: {
    messages: (parent, { groupId }) => Message.find({ groupId }),
    message: (parent, { id }, { user }) => {
      if (!user) {
        throw new Error(ERROR_CODES.NOT_AUTHENTICATED);
      }

      return Message.findById(id);
    },
  },
  Mutation: {
    createMessage: messageService.createMessage,
    messageRead: messageService.messageRead,
    message(parent, { id }, { user }) {
      if (!user) {
        throw new Error(ERROR_CODES.NOT_AUTHENTICATED);
      }

      return { id };
    },
  },
  Subscription: {
    messageAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([MESSAGE_ADDED]),
        async ({ messageAdded: { groupId: mGroupId } }, { groupId }, { user }) => {
          if (groupId) {
            return mGroupId.toString() === groupId;
          }

          const userGroup = await UserGroup.findOne({
            groupId: mGroupId,
            userId: user.id,
          });

          if (userGroup) {
            return true;
          }

          return false;
        },
      ),
    },
    messageRead: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([MESSAGE_READ]),
        ({ messageRead }, args) => messageRead._id.equals(args.id),
      ),
    },
  },
};