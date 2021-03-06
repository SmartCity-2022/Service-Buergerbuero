const express = require("express");
const router = express.Router();
const db = require("../models");
const rabbitmq = require("../utils/rabbitmq");
const { auth } = require("../middlewares/auth");
require("dotenv").config();

router.get("/", async (req, res) => {
    const id = req.query.id;
    const email = req.query.email;
    const { first_name, last_name } = req.body;
    let citizenlist;
    if (id) {
        citizenlist = await db.citizen.findOne({
            where: { id: id },
        });
    } else if (email) {
        citizenlist = await db.citizen.findOne({
            where: { email: email },
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
        rabbitmq.publish(
            "service.buergerbuero.citizen_created",
            JSON.stringify({ email: citizen.email })
        );

        res.status(201).json(citizen);
    }
});

router.patch("/move/", auth, async (req, res) => {
    const { email, street, building_number, type } = req.body;
    if (!email || !street || !building_number || !type) {
        res.status(404).send("something went wrong");
    } else {
        let citizen = await db.citizen.update(
            { street: street, building_number: building_number },
            { where: { email: email } }
        );
        if (!citizen) {
            res.status(500).json("wasnt able to update citizen");
        } else {
            routing_key = undefined;
            if (type == "away") {
                routing_key = "service.buergerbuero.citizen_moved_away";
            }
            if (type == "within") {
                routing_key = "service.buergerbuero.citizen_moved_within";
            }

            rabbitmq.publish(routing_key, JSON.stringify({ email: email }));

            res.status(200).json("success");
        }
    }
});

router.post("/verify/", async (req, res) => {
    const { email } = req.body;
    if (!email) {
        res.status(404).send("something went wrong");
    } else {
        citizen = await db.citizen.findOne({
            where: { email: email },
        });
        if (!citizen) {
            res.status(202).json({ exists: false });
        } else {
            res.status(202).json({ exists: true });
        }
    }
});

router.delete("/", auth, async (req, res) => {
    const id = req.query.id;
    const del = await db.citizen.destroy({ where: { id: id } });
    if (!del) {
        res.status(404).send("something went wrong");
    } else {
        res.status(202).send("success");
    }
});

module.exports = router;
