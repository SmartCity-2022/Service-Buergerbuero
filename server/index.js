const express = require("express");
const cors = require("cors");

const app = express();
const db = require("./models");

app.use(express.json());
app.use(cors());

// rounters
const testRouter = require("./routes/test");
app.use("/test", testRouter);

db.sequelize.sync().then(() => {
    app.listen(3001, () => {
        console.log("server running");
    });
});
