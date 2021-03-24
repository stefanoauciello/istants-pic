const { CronJob } = require('cron');
const { doConsume } = require('./services/rabbitmq-service');
const { areWeTestingWithJest } = require('./utils/utils');

// start job to consume message on rabbitmq queue
const job = new CronJob('*/1 * * * * *', async () => {
  await doConsume();
});
if (!areWeTestingWithJest()) {
  job.start();
}
