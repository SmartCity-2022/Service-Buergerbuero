require("dotenv").config();

// settings
var rebuild = process.env.REBUILD === "true";
const port = process.env.PORT;
//

const { create_mockdata } = require("./mockdata");
const express = require("express");
const cors = require("cors");

const app = express();
const db = require("./models");
const rabbitmq = require("./rabbitmq");

app.use(express.json());
app.use(cors());

// rounters
app.use("/feedback", require("./routes/feedback"));
app.use("/lost_property", require("./routes/lost_property"));
app.use("/citizen", require("./routes/citizen"));
app.use("/appointment", require("./routes/appointment"));
app.use("/request", require("./routes/request"));

db.sequelize.sync({ force: rebuild }).then(async () => {
    if (rebuild) {
        await create_mockdata(10);
    }
    app.listen(port, async () => {
        console.log(`\nserver running on port: ${port}\n`);

        try {
            const con = await rabbitmq.connect();
            const ch = await con.createChannel();

            const queue = await ch.assertQueue("citizenQueue", {
                durable: true,
                exclusive: true,
            });
            await ch.bindQueue(
                queue.queue,
                "exchange",
                "service.buergerbuero.citizen_created"
            );
            await ch.consume(queue.queue, (msg) => {
                string = msg.content.toString();
                j = JSON.parse(string);
                console.log(j);
                ch.ack(msg);
            });
        } catch (error) {
            throw error;
        }
    });
});
