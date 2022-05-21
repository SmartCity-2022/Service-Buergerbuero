const express = require("express");
const router = express.Router();
const db = require("../models");
const rabbitmq = require("../rabbitmq");
const { auth } = require("../middlewares/auth");
require("dotenv").config();

router.get("/", auth, async (req, res) => {
    console.log("test auth");
    res.send("OK");
});

module.exports = router;
