const { $$asyncIterator } = require('iterall');
const { PubSub } = require('apollo-server');

const pubsub = new PubSub();

pubsub.asyncAuthIterator = (messages, authPromise) => {
  const asyncIterator = pubsub.asyncIterator(messages);

  return {
    next() {
      return authPromise.then(() => asyncIterator.next());
    },
    return() {
      return authPromise.then(() => asyncIterator.return());
    },
    throw(error) {
      return asyncIterator.throw(error);
    },
    [$$asyncIterator]() {
      return asyncIterator;
    },
  };
};

module.exports = pubsub;
