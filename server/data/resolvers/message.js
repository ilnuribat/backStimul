const { withFilter } = require('apollo-server');
const { pubsub } = require('../subscriptions');
const { messageLogic, subscriptionLogic } = require('../logic');
const { MESSAGE_ADDED_TOPIC } = require('../resolvers');


module.exports = {
  Message: {
    to(message, args, ctx) {
      return messageLogic.to(message, args, ctx);
    },
    from(message, args, ctx) {
      return messageLogic.from(message, args, ctx);
    },
  },
  Mutation: {
    createMessage(_, args, ctx) {
      return messageLogic.createMessage(_, args, ctx)
        .then((message) => {
          // Publish subscription notification with message
          pubsub.publish(MESSAGE_ADDED_TOPIC, { [MESSAGE_ADDED_TOPIC]: message });

          return message;
        });
    },
  },
  Subscription: {
    messageAdded: {
      subscribe: withFilter(
        (payload, args, ctx) => pubsub.asyncAuthIterator(
          MESSAGE_ADDED_TOPIC,
          subscriptionLogic.messageAdded(payload, args, ctx),
        ),
        (payload, args, ctx) => {
          return ctx.user.then((user) => {
            return Boolean(
              args.groupIds
              && !args.groupIds.indexOf(payload.messageAdded.groupId)
              && user.id !== payload.messageAdded.userId, // don't send to user creating message
            );
          });
        },
      ),
    },
  },
};
