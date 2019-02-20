const { Schema } = require('mongoose');

const user = new Schema({
  id1C: String,
  email: String,
  firstName: String,
  lastName: String,
  middleName: String,
  initials: String,
  fullName: String,
  specialization: String,
  isWorking: Boolean,
  birthdate: String,
  OU: [String],
  lastNotificationId: Schema.Types.ObjectId,
});

module.exports = user;
