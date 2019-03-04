const { UserGroup, User } = require('../models');

async function getApprovers(task) {
  const ugs = await UserGroup.find({
    groupId: task._id,
    type: 'APPROVER',
  }).lean();

  const approvers = await User.find({
    _id: {
      $in: ugs.map(ug => ug.userId),
    },
  }).lean();
  const approverMap = approvers.reduce((acc, cur) => {
    acc[cur._id.toString()] = cur;

    return acc;
  }, {});

  return ugs.map(a => ({
    user: approverMap[a.userId.toString()],
    comment: a.comment,
    decision: a.approveDecision,
  }));
}

async function makeDecision({
  task, user, decision, comment,
}) {
  // check user if approver
  const approver = await UserGroup.findOne({
    userId: user._id,
    groupId: task._id,
    type: 'APPROVER',
  });

  if (!approver) {
    throw new Error('you are not approver');
  }

  const res = await UserGroup.updateOne({
    userId: user._id,
    groupId: task._id,
    type: 'APPROVER',
  }, {
    $set: {
      comment,
      approveDecision: decision,
    },
  });

  // TODO send notification

  return res.nModified;
}

async function addApprover(task, userId) {
  if (!task) {
    throw new Error('taskId is required');
  }
  const approver = await User.findById(userId);

  if (!approver) {
    throw new Error('no approver found');
  }

  try {
    await UserGroup.create({
      groupId: task._id,
      userId,
      type: 'APPROVER',
    });
    // TODO add notification about it

    return true;
  } catch (err) {
    if (err.message.indexOf('duplicate key error')) {
      return false;
    }

    throw err;
  }
}

async function removeApprover(task, userId) {
  if (!task) {
    throw new Error('taskId is required');
  }
  const approver = await UserGroup.findOne({
    userId,
    groupId: task._id,
    type: 'APPROVER',
  });

  if (!approver) {
    throw new Error('no approver found to remove');
  }

  await UserGroup.deleteOne({
    userId,
    groupId: task._id,
    type: 'APPROVER',
  });
  // TODO add notification

  return true;
}

module.exports = {
  makeDecision,
  getApprovers,
  addApprover,
  removeApprover,
};
