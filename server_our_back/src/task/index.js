const { Service } = require('moleculer');
const { Task } = require('../main/models');
const { connectToMongo } = require('../utils/connectDB');

module.exports = class TaskService extends Service {
  constructor(broker) {
    super(broker);

    this.parseServiceSchema({
      name: 'task',
      actions: {
        getOne: {
          params: {
            id: 'string',
          },
          handler: ctx => this.getOne(ctx.params),
        },
        get: {
          params: {
            columnId: 'number',
          },
          handler: ctx => this.get(ctx.params),
        },
        create: {
          params: {

          },
          handler: ctx => this.create(ctx.params),
        },
        update: {
          params: {

          },
          handler: ctx => this.update(ctx.params),
        },
        deleteOne: {
          params: {

          },
          handler: ctx => this.deleteOne(ctx.params),
        },
      },
      started: async () => {
        await connectToMongo();
      },
    });
  }

  async getOne({ id }) {
    const task = await Task.findById(id).lean();

    task.id = task._id;

    return task;
  }

  async get({ columnId }) {
    const tasks = await Task.find({ columnId }).sort({ priority: 1 }).lean();

    return tasks.map(t => ({
      id: t._id,
      ...t,
    }));
  }

  async create(input) {
    const task = await Task.create(input);

    return {
      ...task,
      id: task._id,
    };
  }

  async update({ id, input }) {
    const task = await Task.findById(id);

    await task.update(input);
  }

  async deleteOne({ id }) {
    return Task.deleteOne({ _id: id });
  }
};
