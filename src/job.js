const { CronJob } = require('cron');
const { doConsume } = require('./services/rabbitmq-service');

const job = new CronJob('*/1 * * * * *', async () => {
  await doConsume();
});
job.start();
