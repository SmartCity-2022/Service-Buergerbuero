const express = require("express");
const router = express.Router();
const db = require("../models");
const rabbitmq = require("../utils/rabbitmq");
const { auth } = require("../middlewares/auth");
require("dotenv").config();
const { create_mockdata } = require("../mockdata");

router.get("/", auth, async (req, res) => {
    res.json(req.user.email);
});

router.get("/mock", async (req, res) => {
    await create_mockdata(5);
    res.send("mockdata created");
});

router.post("/bulk_waste", auth, async (req, res) => {
    res.json("bulk_waste");
});

module.exports = router;
