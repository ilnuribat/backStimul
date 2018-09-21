const dotenv = require('dotenv');

dotenv.config();

export const {
  JWT_SECRET,
} = process.env;

const defaults = {
  JWT_SECRET: 'secret',
};

Object.keys(defaults).forEach((key) => {
  if (!process.env[key] || process.env[key] === defaults[key]) {
    throw new Error(`Please enter a custom ${key} in .env on the root directory`);
  }
});

export default JWT_SECRET;
