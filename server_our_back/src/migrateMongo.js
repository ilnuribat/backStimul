const { connectToMongo } = require('./utils/connectDB');
const { Task } = require('./main/models');

async function start() {
  await connectToMongo();
  const cursor = Task.find({}).cursor();

  async function update(err, row) {
    if (err) {
      throw err;
    }

    await row.update({ priority: 3 });

    return cursor.next(update);
  }

  cursor.next(update);
}

start();
