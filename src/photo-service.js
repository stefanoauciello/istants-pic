const mysql = require('mysql2');
const amqplib = require("amqplib");

const config = {
    host: "127.0.0.1",
    port: 3306,
    user: "instant",
    password: "instant"
};

const amqp_url = 'amqp://localhost:5672';

async function getPhotos(req, res) {
    try {
        const dbConnection = await mysql.createConnection(config).promise();
        const [rows] = await dbConnection.execute('SELECT ID, NAME, WEIGHT, LENGTH, LATITUDE, LONGITUDE, USERNAME, UPDATED_AT, CREATED_AT FROM instant.PHOTOS;');
        res.status(200).json({
            rows: rows
        })
    } catch (e) {
        res.status(400).json({
            error: e
        })
    }
    return res;
}

async function uploadPhoto(req, res) {
    try {
        const dbConnection = await mysql.createConnection(config).promise();
        await dbConnection.query('INSERT INTO instant.PHOTOS (NAME, WEIGHT, LENGTH, LATITUDE, LONGITUDE, USERNAME) VALUES(?, ?, ?, ?, ?, ?)',
            [req.body.NAME, req.body.WEIGHT, req.body.LENGTH, req.body.LATITUDE, req.body.LONGITUDE, req.body.USERNAME]);
        await sendNotify()
        res.status(200).json({
            success: true,
            message: 'Success',
        })
    } catch (e) {
        res.status(400).json({
            error: e
        })
    }
    return res;
}

async function sendNotify() {
    console.log("Publishing");
    const conn = await amqplib.connect(amqp_url, "heartbeat=60");
    const ch = await conn.createChannel()
    const exch = 'test_exchange';
    const q = 'test_queue';
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

async function do_consume() {
    console.log("DoConsume");
    var conn = await amqplib.connect(amqp_url, "heartbeat=60");
    var ch = await conn.createChannel()
    var q = 'test_queue';
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

module.exports = {getPhotos, uploadPhoto, do_consume};