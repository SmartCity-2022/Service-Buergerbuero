const amqp = require("amqplib");
require("dotenv").config();

const connection = amqp.connect(process.env.AMQPHOST).catch((error) => {
    console.error(error);
});

function connect() {
    return connection;
}

module.exports = { connect };
