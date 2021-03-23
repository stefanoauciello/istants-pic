const { CronJob } = require('cron');
const { doConsume } = require('./services/rabbitmq-service');

// start job to consume message on rabbitmq queue
const job = new CronJob('*/1 * * * * *', async () => {
  await doConsume();
});
job.start();
