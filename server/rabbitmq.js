const amqp = require("amqplib");
require("dotenv").config();

const connection = amqp.connect(process.env.AMQPHOST, (error0, connecttion) => {
    if (error0) throw error0;
});

function connect() {
    return connection;
}

module.exports = { connect };
