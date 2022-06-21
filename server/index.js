require("dotenv").config();

// settings
var rebuild = process.env.REBUILD === "true";
const port = process.env.PORT;
//

const { create_mockdata } = require("./mockdata");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const db = require("./models");
const rabbitmq = require("./utils/rabbitmq");

app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_HOST || true, credentials: true }));

// rounters
app.use("/feedback", require("./routes/feedback"));
app.use("/lost_property", require("./routes/lost_property"));
app.use("/citizen", require("./routes/citizen"));
app.use("/appointment", require("./routes/appointment"));
app.use("/request", require("./routes/request"));
app.use("/misc", require("./routes/misc"));

db.sequelize.sync({ force: rebuild }).then(async () => {
    if (rebuild) {
        await create_mockdata(10);
    }
    app.listen(port, async () => {
        console.log(`\nserver running on port: ${port}\n`);

        try {
            await rabbitmq.listen("", "service.world", (secret) => {
                process.env.JWT_SECRET = secret;
            });

            await rabbitmq.publish("service.hello", "buergerbuero");
        } catch (error) {
            console.error(error);
        }
    });
});

module.exports = { app };
