const { CronJob } = require('cron');
const { doConsume } = require('./services/rabbitmq-service');
const { areWeTestingWithJest } = require('./utils/utils');

// start job to consume message on rabbitmq queue
const job = new CronJob('*/1 * * * * *', async () => {
  try {
    await doConsume();
  } catch (e) {
    throw new Error(e.toString());
  }
});
if (!areWeTestingWithJest()) {
  job.start();
}
