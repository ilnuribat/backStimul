const { Notify } = require('../models');

module.exports = {
  Query: {
    notifys: async (_, { offset = 0, limit = 10 }, { user }) => {
      if (!user._id) {
        return true;
      }

      const docs = await Notify.find({ usersId: user._id })
        .skip(offset)
        .limit(limit)
        .sort({ updatedAt: -1 });

      if (!docs) return false;

      return docs;
    },
  },
  Mutation: {
    notifys: async (_, { id }, { user }) => {
      if (!user._id) {
        return 'user._id is null';
      }
      const cond = { _id: id, usersId: user._id };
      const Doc = await Notify.findOne(cond, async (err, doc) => {
        if (err) {
          return `cant find ${id}`;
        }
        let newUsers = [];

        newUsers = doc.usersId && doc.usersId.filter(u => u !== user._id.toString());
        if (!newUsers || newUsers.length < 1) {
          await doc.remove();

          return `${doc} удалён`;
        }

        /* eslint no-param-reassign: "error" */

        doc.usersId = newUsers;
        const savedDoc = await doc.save((error, saveddoc) => {
          if (error) return error;

          return saveddoc;
        });

        return savedDoc;
      });

      if (!Doc) return `Документ ${id} с юзером ${user._id} не найден`;

      return `Юзер удалён из ${Doc.name}`;
    },
  },
};
