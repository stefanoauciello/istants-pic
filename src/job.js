const CronJob = require('cron').CronJob;
const { doConsume } = require("./services/rabbitmq-service");

const job = new CronJob("*/1 * * * * *", async () => {
    await doConsume();
});
job.start();