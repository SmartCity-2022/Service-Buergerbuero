const amqp = require("amqplib");
require("dotenv").config();
let channel = undefined;
const connection = amqp
    .connect(process.env.AMQPHOST)
    .then(async (con) => {
        channel = await con.createChannel();
    })
    .catch((error) => {
        console.error(error);
    });

function get_connection() {
    return connection;
}

function get_channel() {
    return channel;
}

async function listen(queue_name, routing_key, callback) {
    try {
        await channel.assertExchange(process.env.RABBITMQEXCHANGE, "topic", {
            durable: true,
        });

        const queue = await channel.assertQueue(queue_name, {
            durable: true,
            exclusive: false,
            autoDelete: true,
        });

        await channel.bindQueue(
            queue.queue,
            process.env.RABBITMQEXCHANGE,
            routing_key
        );

        await channel.consume(queue.queue, (message) => {
            console.log(
                `consumed "${message.content.toString()}" from "${
                    message.fields.routingKey
                }"`
            );
            callback(message.content.toString());
            channel.ack(message);
        });
    } catch (error) {
        console.error(error);
    }
}

async function publish(routing_key, payload) {
    try {
        await channel.assertExchange(process.env.RABBITMQEXCHANGE, "topic", {
            durable: true,
        });

        channel.publish(
            process.env.RABBITMQEXCHANGE,
            routing_key,
            Buffer.from(payload)
        );
        console.log(`published "${payload}" at "${routing_key}"`);
    } catch (error) {
        console.error(error);
    }
}

module.exports = { get_connection, get_channel, listen, publish };
