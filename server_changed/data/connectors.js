const _ =  require('lodash');
const faker =  require('faker');
const Sequelize =  require('sequelize');
const bcrypt =  require('bcrypt');
const { Schema } = require('mongoose');

// initialize our database
const db = new Sequelize('chatty', null, null, {
  dialect: 'sqlite',
  storage: './chatty.sqlite',
  logging: false, // mark this true if you want to see logs
});

// // define groups
// const GroupModel = db.define('group', {
//   name: { type: Sequelize.STRING },
// });

// // define messages
// const MessageModel = db.define('message', {
//   text: { type: Sequelize.STRING },
// });

// // define users
// const UserModel = db.define('user', {
//   email: { type: Sequelize.STRING },
//   username: { type: Sequelize.STRING },
//   password: { type: Sequelize.STRING },
//   version: { type: Sequelize.INTEGER }, // version the password
// });



/* New */
/* New */
/* New */
/* New */
// const ColumnModel = db.define('column', {
//   name: Sequelize.STRING,
//   order: Sequelize.INTEGER,
//   createdAt: {
//     type: Sequelize.DATE,
//     defaultValue: new Date(),
//   },
//   updatedAt: {
//     type: Sequelize.DATE,
//     defaultValue: new Date(),
//   },
//   projectId: {
//     type: Sequelize.INTEGER,
//     references: {
//       model: 'Project',
//       onDelete: 'SET NULL',
//       onUpdate: 'CASCADE',
//     },
//   },
// });
// const PriorityModel = db.define('priority', {
//   id: {
//     type: Sequelize.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   name: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
// });
// const ProjectModel = db.define('project', {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     primaryKey: true,
//   },
//   title: Sequelize.STRING,
//   description: Sequelize.TEXT,
//   parentId: {
//     type: Sequelize.INTEGER,
//     references: {
//       model: 'ProjectGroup',
//     },
//   },
// });
// const ProjectGrModel = db.define('projectgr', {
//   id: {
//     type: Sequelize.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   name: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   createdBy: {
//     type: Sequelize.INTEGER,
//     references: {
//       model: 'User',
//     },
//     onDelete: 'CASCADE',
//     onUpdate: 'CASCADE',
//     allowNull: false,
//   },
//   parentId: {
//     type: Sequelize.INTEGER,
//     references: {
//       model: 'ProjectGroup',
//     },
//     onDelete: 'CASCADE',
//     onUpdate: 'CASCADE',
//     allowNull: false,
//   },
// });
// const ProjectUsrModel = db.define('projectusr', {
//   userId: {
//     type: Sequelize.INTEGER,
//   },
//   projectId: {
//     type: Sequelize.INTEGER,
//   },
// });
// const SessionModel = db.define('session', {
//   id: {
//     type: Sequelize.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   token: {
//     type: Sequelize.UUID,
//     unique: true,
//   },
//   createdAt: Sequelize.DATE,
//   userId: {
//     type: Sequelize.INTEGER,
//     allowNull: false,
//   },
//   ip: Sequelize.STRING,
//   userAgent: Sequelize.STRING,
// });
// const OldUsersModel = db.define('users', {
//   username: {
//     unique: true,
//     type: Sequelize.STRING,
//   },
//   email: {
//     unique: true,
//     type: Sequelize.STRING,
//   },
//   password: Sequelize.STRING,
// });


// const TaskModel = new Schema({
//   name: String,
//   description: String,
//   createdAt: Date,
//   updatedAt: Date,
//   deletedAt: Date,
//   columnId: Number,
//   createdBy: Number,
//   priority: {
//     type: Number,
//     default: 3,
//   },
// }, {
//   timestamps: {
//     createdAt: 'createdAt',
//     updatedAt: 'updatedAt',
//   },
// });


/* end new */
/* end new */
/* end new */
/* end new */


// users belong to multiple groups
UserModel.belongsToMany(GroupModel, { through: 'GroupUser' });

// users belong to multiple users as friends
UserModel.belongsToMany(UserModel, { through: 'Friends', as: 'friends' });

// messages are sent from users
MessageModel.belongsTo(UserModel);

// messages are sent to groups
MessageModel.belongsTo(GroupModel);

// groups have multiple users
GroupModel.belongsToMany(UserModel, { through: 'GroupUser' });

// create fake starter data
const GROUPS = 4;
const USERS_PER_GROUP = 5;
const MESSAGES_PER_USER = 5;
// faker.seed(123); // get consistent data every time we reload app

// you don't need to stare at this code too hard
// just trust that it fakes a bunch of groups, users, and messages
// db.sync({ force: true }).then(() => _.times(GROUPS, () => GroupModel.create({
//   name: faker.lorem.words(3),
// }).then(group => _.times(USERS_PER_GROUP, () => {
//   const password = faker.internet.password();
//   return bcrypt.hash(password, 10).then(hash => group.createUser({
//     email: faker.internet.email(),
//     username: faker.internet.userName(),
//     password: hash,
//     version: 1,
//   }).then((user) => {
//     console.log(
//       '{email, username, password}',
//       `{${user.email}, ${user.username}, ${password}}`
//     );
//     _.times(MESSAGES_PER_USER, () => MessageModel.create({
//       userId: user.id,
//       groupId: group.id,
//       text: faker.lorem.sentences(3),
//     }));
//     return user;
//   }));
// })).then((userPromises) => {
//   // make users friends with all users in the group
//   Promise.all(userPromises).then((users) => {
//     _.each(users, (current, i) => {
//       _.each(users, (user, j) => {
//         if (i !== j) {
//           current.addFriend(user);
//         }
//       });
//     });
//   });
// })));

const Group = db.models.group;
const Message = db.models.message;
const User = db.models.user;

export { Group, Message, User };