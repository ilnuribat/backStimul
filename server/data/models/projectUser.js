const { Schema } = require('mongoose');

// define ProjectUsr
export default ProjectUsrSch = new Schema({
  userId: String,
  projectId: String,
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
});