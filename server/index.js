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
app.use("/test", require("./routes/test"));

db.sequelize.sync({ force: rebuild }).then(async () => {
    if (rebuild) {
        await create_mockdata(10);
    }
    app.listen(port, async () => {
        console.log(`\nserver running on port: ${port}\n`);

        try {
            const con = await rabbitmq.connect();
            const ch = await con.createChannel();

            await ch.assertExchange(process.env.RABBITMQEXCHANGE, "topic", {
                durable: true,
            });

            const queue = await ch.assertQueue("", {
                durable: true,
                exclusive: false,
                autoDelete: true,
            });
            await ch.bindQueue(
                queue.queue,
                process.env.RABBITMQEXCHANGE,
                "service.world"
            );
            await ch.consume(queue.queue, (msg) => {
                string = msg.content.toString();
                process.env.JWT_SECRET = string;
                ch.ack(msg);
                console.log("consumed service.world");
            });

            ch.publish(
                process.env.RABBITMQEXCHANGE,
                "service.hello",
                Buffer.from("buergerbuero")
            );
            console.log("published service.hello");
        } catch (error) {
            console.error(error);
        }
    });
});
