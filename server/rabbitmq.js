const amqp = require("amqplib");

const connection = amqp.connect("amqp://@localhost:5672", (error0) => {
    if (error) throw error0;
});

module.exports.connection = connection;
