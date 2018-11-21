const { searchMessages } = require('../services/chat');

module.exports = {
  Query: {
    async search(parent, { text, type }, { user }) {
      let result = [];
      const words = text.split(/\s/);
      const regExQuery = new RegExp(words.join('|'), 'i');

      switch (type) {
        case 'MESSAGES':
          result = await searchMessages(user, regExQuery);

          result = result.map(m => ({
            __typename: 'Message',
            ...m,
          }));
          break;

        default:
          break;
      }


      return result;

      // USER BLOCK

      // const users = await User.find({
      //   email: regExQuery,
      // }).lean().limit(5);


      // users.forEach((u) => {
      //   result.push({
      //     __typename: 'User',
      //     ...u,
      //   });
      // });

      // TASK BLOCK
      // const tasks = await Group.find({
      //   name: regExQuery,
      //   type: 'TASK',
      // }).lean().limit(3);

      // tasks.forEach((t) => {
      //   result.push({
      //     __typename: 'Task',
      //     id: t._id.toString(),
      //     ...t,
      //   });
      // });

      // OBJECT BLOCK
      // const objects = await Group.find({
      //   type: 'OBJECT',
      //   $or: [{
      //     name: regExQuery,
      //   }, {
      //     'address.value': regExQuery,
      //   }],
      // }).lean().limit(3);

      // objects.forEach((o) => {
      //   result.push({
      //     __typename: 'Object',
      //     id: o._id.toString(),
      //     ...o,
      //   });
      // });


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
