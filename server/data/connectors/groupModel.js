import Sequelize from 'sequelize';
import { _ } from 'lodash';
import db from '../connectors';

// define groups
const GroupModel = db.define('group', {
    name: { type: Sequelize.STRING },
  });