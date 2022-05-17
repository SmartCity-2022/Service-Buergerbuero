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
const { connection } = require("./rabbitmq");

app.use(express.json());
app.use(cors());

// rounters
app.use("/feedback", require("./routes/feedback"));
app.use("/lost_property", require("./routes/lost_property"));
app.use("/citizen", require("./routes/citizen"));

db.sequelize.sync({ force: rebuild }).then(async () => {
    if (rebuild) {
        await create_mockdata(10);
    }
    app.listen(port, () => {
        console.log(`\nserver running on port: ${port}\n`);
    });
});
