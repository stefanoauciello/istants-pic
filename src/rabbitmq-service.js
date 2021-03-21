const amqplib = require("amqplib");
const amqp_url = 'amqp://localhost:5672';

async function sendNotify(pk) {
    console.log("Publishing pk -> " + pk);
    const connection = await amqplib.connect(amqp_url, "heartbeat=60");
    const channel = await connection.createChannel()
    const exchange = 'instant_exchange';
    const queue = 'instant';
    const routeKey = 'instant_route';
    await channel.assertExchange(exchange, 'direct', {durable: true}).catch(console.error);
    await channel.assertQueue(queue, {durable: true});
    await channel.bindQueue(queue, exchange, routeKey);
    await channel.publish(exchange, routeKey, Buffer.from(pk.toString()));
    setTimeout(() => {
        channel.close();
        connection.close();
    }, 500);
}

async function doConsume() {
    const connection = await amqplib.connect(amqp_url, "heartbeat=60");
    const channel = await connection.createChannel()
    const queue = 'instant';
    await connection.createChannel();
    await channel.assertQueue(queue, {durable: true});
    await channel.consume(queue, (msg) => {
        console.log("MESSAGE READED -> " + msg.content.toString());
        channel.ack(msg);
        channel.cancel('myconsumer');
    }, {consumerTag: 'myconsumer'});
    setTimeout(() => {
        channel.close();
        connection.close();
    }, 500);
}

module.exports = {sendNotify, doConsume};