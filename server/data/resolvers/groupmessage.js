import { map } from 'lodash';
import { withFilter } from 'apollo-server';
import { groupLogic, subscriptionLogic } from './logic';
import { pubsub } from '../subscriptions';

module.exports = {
  Group: {
    users(group, args, ctx) {
      return groupLogic.users(group, args, ctx);
    },
    messages(group, args, ctx) {
      return groupLogic.messages(group, args, ctx);
    },
  },
  Query: {
    group(_, args, ctx) {
      return groupLogic.query(_, args, ctx);
    },
  },
  Mutation: {
    createGroup(_, args, ctx) {
      return groupLogic.createGroup(_, args, ctx).then((group) => {
        pubsub.publish(GROUP_ADDED_TOPIC, { [GROUP_ADDED_TOPIC]: group });
        return group;
      });
    },
    deleteGroup(_, args, ctx) {
      return groupLogic.deleteGroup(_, args, ctx);
    },
    leaveGroup(_, args, ctx) {
      return groupLogic.leaveGroup(_, args, ctx);
    },
    updateGroup(_, args, ctx) {
      return groupLogic.updateGroup(_, args, ctx);
    },
  },
  Subscription: {
    groupAdded: {
      subscribe: withFilter(
        (payload, args, ctx) => pubsub.asyncAuthIterator(
          GROUP_ADDED_TOPIC,
          subscriptionLogic.groupAdded(payload, args, ctx),
        ),
        (payload, args, ctx) => {
          return ctx.user.then((user) => {
            return Boolean(
              args.userId &&
              ~map(payload.groupAdded.users, 'id').indexOf(args.userId) &&
              user.id !== payload.groupAdded.users[0].id, // don't send to user creating group
            );
          });
        },
      ),
    },
  },
};
