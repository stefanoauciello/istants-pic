const {resizePhoto} = require("./resizing-service");
const amqplib = require("amqplib");
const amqp_url = 'amqp://localhost:5672';
const exchange = 'instant_exchange';
const queue = 'instant';
const routeKey = 'instant_route';

async function sendNotify(pk) {
    try {
        console.log("Publishing pk -> " + pk);
        const connection = await amqplib.connect(amqp_url, "heartbeat=60");
        const channel = await connection.createChannel()
        await channel.assertExchange(exchange, 'direct', {durable: true}).catch(console.error);
        await channel.assertQueue(queue, {durable: true});
        await channel.bindQueue(queue, exchange, routeKey);
        await channel.publish(exchange, routeKey, Buffer.from(pk.toString()));
        setTimeout(() => {
            channel.close();
            connection.close();
        }, 500);
    } catch (e) {
        throw new Error(e);
    }
}


async function doConsume() {
    try {
        const connection = await amqplib.connect(amqp_url, "heartbeat=60");
        const channel = await connection.createChannel()
        await connection.createChannel();
        await channel.assertQueue(queue, {durable: true});
        await channel.consume(queue, async (msg) => {
            console.log("MESSAGE READED -> " + msg.content.toString());
            await resizePhoto(msg.content.toString());
            await channel.ack(msg);
            await channel.cancel('myconsumer');
        }, {consumerTag: 'myconsumer'});
        setTimeout(() => {
            channel.close();
            connection.close();
        }, 500);
    } catch (e) {
        throw new Error(e);
    }
}

module.exports = {sendNotify, doConsume};