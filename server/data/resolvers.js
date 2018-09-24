// const GraphQLDate = require('graphql-date');
const _ = require('lodash');
const { withFilter } = require('apollo-server');
const { map } = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const { Group, Message, User } = require('./connectors');
const { pubsub } = require('./subscriptions');
const models = require('./models');
const { JWT_SECRET } = require('../config');
const { User } = require('./models');
const {
  groupLogic, messageLogic, userLogic, subscriptionLogic,
} = require('./logic');

const MESSAGE_ADDED_TOPIC = 'messageAdded';
const GROUP_ADDED_TOPIC = 'groupAdded';

async function authenticate() {
  console.log('fix mee!!!');

  return true;
}

exports.resolvers = {
  MESSAGE_ADDED_TOPIC,
  GROUP_ADDED_TOPIC,
  // Date: GraphQLDate,
  PageInfo: {
    // we will have each connection supply its own hasNextPage/hasPreviousPage functions!
    hasNextPage(connection) {
      return connection.hasNextPage();
    },
    hasPreviousPage(connection) {
      return connection.hasPreviousPage();
    },
  },
  Query: {
    glossary: () => true, // hack
    column: async (parent, { id }) => models.Column.findOne({ _id: id }),
    columns: async (parent, { projectId }) => {
      const where = { $and: [] };

      if (projectId) {
        where.$and.push({ projectId });
      }

      return models.Column.find(where);
    },
    group(_, args, ctx) {
      return groupLogic.query(_, args, ctx);
    },
    user(_, args, ctx) {
      return userLogic.query(_, args, ctx);
    },
    project: (parent, { id }) => models.Project.findOne({ where: { id } }),
    projects: async (parent, { userId, parentId }) => {
      const where = { $and: [] };

      if (userId) {
        const projectUsers = await models.ProjectUser.findAll({ where: { userId } });

        where.$and.push({ id: { $in: _.map(projectUsers, 'projectId') } });
      }

      if (parentId) {
        where.$and.push({ parentId });
      }

      return models.Project.find(where);
    },
    projectGroup: (parent, { id }) => models.ProjectGroup.findOne({ where: { id } }),
    projectGroups: (parent, { parentId }, ctx) => {
      authenticate(ctx);

      return models.ProjectGroup.find({
        $and: [{
          parentId,
        }, {
          id: { $ne: 1 },
        }],
      });
    },
    task: async (parent, { id }, ctx) => {
      authenticate(ctx);

      return broker.call('task.getOne', { id });
    },
    tasks: async (parent, { columnId }, ctx) => {
      authenticate(ctx);

      return broker.call('task.get', { columnId });
    },
  },
  Mutation: {
    createTask: async (parent, { input }, ctx) => {
      authenticate(ctx);

      return broker.call('task.create', input);
    },
    updateTask: async (parent, args, ctx) => {
      authenticate(ctx);

      const { id, input } = args;

      return broker.call('task.update', { id, input });
    },
    deleteTask: async (parent, { id }, ctx) => {
      authenticate(ctx);

      return broker.call('task.deleteOne', { id });
    },
    createProjectGroup: (parent, args) => models.ProjectGroup.create(args),
    updateProjectGroup: (parent, args) => models.ProjectGroup.update(args, { where: { id: args.id } }),
    deleteProjectGroup: (parent, { id }) => models.ProjectGroup.destroy({ where: { id } }),
    createProject: async (parent, args) => {
      try {
        const project = await models.sequelize.transaction(async (transaction) => {
          const newProject = await models.Project.create(args, { transaction });

          await models.ProjectUser.create({
            userId: args.createdBy,
            projectId: newProject.id,
          }, { transaction });
          await models.Column.create({ projectId: newProject.id, name: 'To Do', order: 0 },
            { transaction });

          return newProject;
        });

        return project;
      } catch (err) {
        throw new Error(`createProject: ${err.message}`);
      }
    },
    updateProject: async (parent, args) => models.Project.update(
      args, { where: { id: args.id } },
    ),
    deleteProject: (parent, { id }) => models.Project.destroy({
      where: { id },
    }),
    createColumn: (parent, args) => models.Column.create(args),
    updateColumn: async (parent, args) => models.Column.update(
      args,
      {
        where: { id: args.id },
      },
    ),
    deleteColumn: (parent, { id }) => models.Column.destroy({
      where: { id },
    }),
    // },
    createMessage(_, args, ctx) {
      return messageLogic.createMessage(_, args, ctx)
        .then((message) => {
          // Publish subscription notification with message
          pubsub.publish(MESSAGE_ADDED_TOPIC, { [MESSAGE_ADDED_TOPIC]: message });

          return message;
        });
    },
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

    login(_, signinUserInput, ctx) {
      // find user by email
      const { email, password } = signinUserInput.user;

      return User.findOne({ where: { email } }).then((user) => {
        if (user) {
          // validate password
          return bcrypt.compare(password, user.password).then((res) => {
            if (res) {
              // create jwt
              const token = jwt.sign({
                id: user.id,
                email: user.email,
                version: user.version,
              }, JWT_SECRET);

              user.jwt = token;
              ctx.user = Promise.resolve(user);

              return user;
            }

            return Promise.reject('password incorrect');
          });
        }

        return Promise.reject('email not found');
      });
    },
    async signup(_, signinUserInput, ctx) {
      const { email, password, username } = signinUserInput.user;

      // find user by email
      const existing = await User.findOne({ email });

      if (!existing) {
        // hash password and create user
        return bcrypt.hash(password, 10).then(hash => User.create({
          email,
          password: hash,
          username: username || email,
          version: 1,
        })).then((user) => {
          const { id } = user;
          const token = jwt.sign({ id, email, version: 1 }, JWT_SECRET);

          user.jwt = token;
          ctx.user = Promise.resolve(user);

          return user;
        });
      }

      return Promise.reject('email already exists'); // email already exists
    },
  },
  Subscription: {
    messageAdded: {
      subscribe: withFilter(
        (payload, args, ctx) => pubsub.asyncAuthIterator(
          MESSAGE_ADDED_TOPIC,
          subscriptionLogic.messageAdded(payload, args, ctx),
        ),
        (payload, args, ctx) => ctx.user.then(user => Boolean(
          args.groupIds
              && !args.groupIds.indexOf(payload.messageAdded.groupId)
              && user.id !== payload.messageAdded.userId, // don't send to user creating message
        )),
      ),
    },
    groupAdded: {
      subscribe: withFilter(
        (payload, args, ctx) => pubsub.asyncAuthIterator(
          GROUP_ADDED_TOPIC,
          subscriptionLogic.groupAdded(payload, args, ctx),
        ),
        (payload, args, ctx) => ctx.user.then(user => Boolean(
          args.userId
              && !map(payload.groupAdded.users, 'id').indexOf(args.userId)
              && user.id !== payload.groupAdded.users[0].id, // don't send to user creating group
        )),
      ),
    },
  },


  Glossary: {
    priorities: () => models.GlossaryPriority.findAll(),
  },
  Column: {
    project: parent => models.Project.findOne({
      where: { id: parent.projectId },
    }),
    tasks: parent => broker.call('task.get', { columnId: parent.id }),
  },
  Group: {
    users(group, args, ctx) {
      return groupLogic.users(group, args, ctx);
    },
    messages(group, args, ctx) {
      return groupLogic.messages(group, args, ctx);
    },
  },
  Message: {
    to(message, args, ctx) {
      return messageLogic.to(message, args, ctx);
    },
    from(message, args, ctx) {
      return messageLogic.from(message, args, ctx);
    },
  },
  User: {
    email(user, args, ctx) {
      return userLogic.email(user, args, ctx);
    },
    friends(user, args, ctx) {
      return userLogic.friends(user, args, ctx);
    },
    groups(user, args, ctx) {
      return userLogic.groups(user, args, ctx);
    },
    jwt(user, args, ctx) {
      return userLogic.jwt(user, args, ctx);
    },
    messages(user, args, ctx) {
      return userLogic.messages(user, args, ctx);
    },
  },
  Project: {
    creator: parent => models.User.findOne({
      where: { id: parent.createdBy },
    }),
    columns: parent => models.Column.findAll({
      where: { projectId: parent.id },
    }),
  },
  ProjectGroup: {
    projectGroups: parent => models.ProjectGroup.findAll({
      where: {
        $and: [{
          parentId: parent.id,
        }, {
          id: { $ne: 1 },
        }],
      },
    }),
    projects: parent => models.Project.findAll({ where: { parentId: parent.id } }),
  },
  Task: {
    column: parent => Column.findOne({
      where: { id: parent.columnId },
    }),
    creator: parent => User.findOne({
      where: { id: parent.createdBy },
    }),
  },

};

export default resolvers;
