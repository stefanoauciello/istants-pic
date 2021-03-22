const amqplib = require('amqplib');
const { resizePhoto } = require('./resizing-service');

const amqpUrl = 'amqp://localhost:5672';
const exchange = 'instant_exchange';
const queue = 'instant';
const routeKey = 'instant_route';

async function sendNotify(pk) {
  console.log(`Publishing pk -> ${pk}`);
  const connection = await amqplib.connect(amqpUrl, 'heartbeat=60');
  const channel = await connection.createChannel();
  await channel.assertExchange(exchange, 'direct', { durable: true }).catch(console.error);
  await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(queue, exchange, routeKey);
  await channel.publish(exchange, routeKey, Buffer.from(pk.toString()));
  await channel.close();
  await connection.close();
}

async function doConsume() {
  const connection = await amqplib.connect(amqpUrl, 'heartbeat=60');
  const channel = await connection.createChannel();
  await connection.createChannel();
  await channel.assertQueue(queue, { durable: true });
  await channel.consume(queue, async (msg) => {
    console.log(`Message readed -> ${msg.content.toString()}`);
    await resizePhoto(msg.content.toString());
    await channel.ack(msg);
    await channel.close();
    await connection.close();
  });
}

module.exports = { sendNotify, doConsume };
