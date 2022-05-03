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

const rebuild = false;
db.sequelize.sync({ force: rebuild }).then(async () => {
    if (rebuild) {
        await create_mockdata(10);
    }
    app.listen(3001, () => {
        console.log("server running");
    });
});
