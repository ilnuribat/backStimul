const broker = require('./broker');
const { MICROSERVICES } = require('./config');

const all = [
  'main',
  'chat',
  'task',
];
const services = [];

if (!MICROSERVICES) {
  services.push(...all);
} else {
  services.push(...MICROSERVICES.split(','));
}

services.forEach(service => broker.loadService(`${__dirname}/${service}`));

broker
  .start();
// .then(() => broker.call('task.getOne', { id: '111' }))
// .then(res => logg.info(res))
// .catch(err => logg.error(err))
