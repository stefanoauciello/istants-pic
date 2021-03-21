const amqplib = require("amqplib");
const amqp_url = 'amqp://localhost:5672';

async function sendNotify() {
    console.log("Publishing");
    const conn = await amqplib.connect(amqp_url, "heartbeat=60");
    const ch = await conn.createChannel()
    const exch = 'test_exchange';
    const q = 'instant';
    const rkey = 'test_route';
    const msg = 'Hello World!';
    await ch.assertExchange(exch, 'direct', {durable: true}).catch(console.error);
    await ch.assertQueue(q, {durable: true});
    await ch.bindQueue(q, exch, rkey);
    await ch.publish(exch, rkey, Buffer.from(msg));
    setTimeout(function () {
        ch.close();
        conn.close();
    }, 500);
}

async function doConsume() {
    console.log("DoConsume");
    var conn = await amqplib.connect(amqp_url, "heartbeat=60");
    var ch = await conn.createChannel()
    var q = 'instant';
    await conn.createChannel();
    await ch.assertQueue(q, {durable: true});
    await ch.consume(q, function (msg) {
        console.log("MESSAGE READED -> " + msg.content.toString());
        ch.ack(msg);
        ch.cancel('myconsumer');
    }, {consumerTag: 'myconsumer'});
    setTimeout( function()  {
        ch.close();
        conn.close();},  500 );
}

module.exports = {sendNotify, doConsume};