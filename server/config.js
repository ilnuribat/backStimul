import dotenv from 'dotenv';

dotenv.config({ silent: true });

// export const {
//   JWT_SECRET,
// } = process.env;

// const defaults = {
//   JWT_SECRET: 'key',
// };

// Object.keys(defaults).forEach((key) => {
//   if (!process.env[key] || process.env[key] === defaults[key]) {
//     throw new Error(`Please enter a custom ${key} in .env on the root directory`);
//   }
// });
const JWT_SECRET = 'key';

export default JWT_SECRET;
