const { Message } = require('../models');

function formWhere({ id, before, after }) {
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

  return where;
}

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
  getPageInfo,
  formWhere,
};
