const { User, Group, Message } = require('../models');

module.exports = {
  Query: {
    async search(parent, { text }, { user }) {
      const result = [];
      const words = text.split(/\s/);
      const regExQuery = new RegExp(words.join('|'), 'i');
      // USER BLOCK

      const users = await User.find({
        email: regExQuery,
      }).lean().limit(5);


      users.forEach((u) => {
        result.push({
          __typename: 'User',
          ...u,
        });
      });

      // TASK BLOCK
      const tasks = await Group.find({
        name: regExQuery,
        type: 'TASK',
      }).lean().limit(3);

      tasks.forEach((t) => {
        result.push({
          __typename: 'Task',
          id: t._id.toString(),
          ...t,
        });
      });

      // OBJECT BLOCK
      const objects = await Group.find({
        type: 'OBJECT',
        $or: [{
          name: regExQuery,
        }, {
          'address.value': regExQuery,
        }],
      }).lean().limit(3);

      objects.forEach((o) => {
        result.push({
          __typename: 'Object',
          id: o._id.toString(),
          ...o,
        });
      });

      // MESSAGE BLOCK
      const messages = await Message.find({
        text: regExQuery,
        userId: user.id,
      }).lean().limit(3);

      messages.forEach((m) => {
        result.push({
          __typename: 'Message',
          ...m,
        });
      });


      return result;
      // [{
      //   _id: 'asdf1',
      //   id: 'asdf2',
      //   email: 'Ilnur1',
      //   __typename: 'User',
      // }, {
      //   __typename: 'Task',
      //   id: 'asdf',
      //   name: 'new task',
      // }, {
      //   __typename: 'Object',
      //   id: 'address id',
      //   name: 'Ufa',
      // }, {
      //   __typename: 'Message',
      //   id: 'message id',
      //   text: 'some message text',
      // }];
    },
  },
  SearchResult: {
    __resolveType: ({ __typename }) => __typename,
  },
};
