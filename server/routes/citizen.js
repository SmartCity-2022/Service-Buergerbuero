const express = require("express");
const router = express.Router();
const db = require("../models");
const rabbitmq = require("../rabbitmq");

router.get("/", async (req, res) => {
    const id = req.query.id;
    const { first_name, last_name } = req.body;
    let citizenlist;
    if (id) {
        citizenlist = await db.citizen.findOne({
            where: { id: id },
        });
    } else if (first_name && last_name) {
        citizenlist = await db.citizen.findOne({
            where: { first_name: first_name, last_name: last_name },
        });
    } else {
        citizenlist = await db.citizen.findAll();
    }

    if (!citizenlist) {
        res.status(404).send("something went wrong");
    } else {
        res.status(200).json(citizenlist);
    }
});

router.post("/", async (req, res) => {
    const citizen = await db.citizen.create(req.body);
    if (!citizen) {
        res.status(404).send("something went wrong");
    } else {
        const conn = await rabbitmq.connect();
        const channel = await conn.createChannel();
        await channel.assertExchange("exchange", "topic", { durable: false });
        channel.publish(
            "exchange",
            "service.buergerbuero.citizen_created",
            Buffer.from(citizen.email)
        );
        res.status(201).json(citizen);
    }
});

router.delete("/", async (req, res) => {
    const id = req.query.id;
    const del = await db.citizen.destroy({ where: { id: id } });
    if (!del) {
        res.status(404).send("something went wrong");
    } else {
        res.status(202).send("success");
    }
});

module.exports = router;
