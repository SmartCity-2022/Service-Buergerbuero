const amqp = require("amqplib");

const connection = amqp.connect(
    "amqp://localhost:5672",
    (error0, connecttion) => {
        if (error0) throw error0;
    }
);

function connect() {
    return connection;
}

module.exports = { connect };
