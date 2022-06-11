const express = require("express");
const router = express.Router();
const db = require("../models");

router.get("/", async (req, res) => {
    const id = req.query.id;
    let appointments;
    if (id) {
        appointments = await db.appointment.findOne({
            where: { id: id },
        });
    } else {
        appointments = await db.appointment.findAll();
    }
    if (!appointments) {
        res.status(404).send("something went wrong");
    } else {
        res.status(200).json(appointments);
    }
});

router.post("/", async (req, res) => {
    const { email, from, to } = req.body;
    if (!email || !from || !to) {
        res.status(404).send("something went wrong");
    } else {
        const citizen = await db.citizen.findOne({ where: { email: email } });
        const a = await citizen.createAppointment({
            from: from,
            to: to,
        });
        if (!a) {
            res.status(404).send("something went wrong");
        } else {
            res.status(201).json(a);
        }
    }
});

router.delete("/", async (req, res) => {
    const id = req.query.id;
    const del = await db.appointment.destroy({ where: { id: id } });
    if (!del) {
        res.status(404).send("something went wrong");
    } else {
        res.status(202).send("success");
    }
});

module.exports = router;
