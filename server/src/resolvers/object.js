module.exports = {
  rootObject: {
    addresses: () => [{
      id: 1,
      name: 'Уфа, Ленина 14',
    }],
    objects: () => [{
      id: 2,
      name: 'Казарма',
      tasks: [{
        id: 3,
        name: 'забор',
      }],
    }],
  },
  Query: {
    rootObject() {
      return {
        addresses: [],
        objects: [],
      };
    },
    object() {
      return {
        id: 1,
        name: 'object test',
      };
    },
  },
};
