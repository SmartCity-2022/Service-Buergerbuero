require("dotenv").config()

// settings
var rebuild = (process.env.REBUILD === "true");
const port = process.env.PORT;
//

const { create_mockdata } = require("./mockdata");
const express = require("express");
const cors = require("cors");

const app = express();
const db = require("./models");

app.use(express.json());
app.use(cors());

// rounters
const feedback_router = require("./routes/feedback");
app.use("/feedback", feedback_router);
const lost_property_router = require("./routes/lost_property");
app.use("/lost_property", lost_property_router);
const citizen_router = require("./routes/citizen");
app.use("/citizen", citizen_router);

db.sequelize.sync({ force: rebuild }).then(async () => {
    if (rebuild) {
        await create_mockdata(10);
    }
    app.listen(port, () => {
        console.log(`\nserver running on port: ${port}\n\n`);
    });
});
