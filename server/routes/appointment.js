const express = require("express");
const router = express.Router();
const db = require("../models");
const sequelize = require("sequelize");
const { auth } = require("../middlewares/auth");

router.get("/", async (req, res) => {
    const id = req.query.id;
    const cid = req.query.cid;
    const email = req.query.email;
    const start_date = req.query.start_date;
    const end_date = req.query.end_date;

    let appointments;
    if (email) {
        appointments = await db.appointment.findAll({
            where: { "$citizen.email$": email },
            include: [{ model: db.citizen, as: db.citizen.tableName }],
        });
    } else if (cid) {
        appointments = await db.appointment.findAll({
            where: { citizenId: cid },
        });
    } else if (id) {
        appointments = await db.appointment.findOne({
            where: { id: id },
        });
    } else if (start_date && end_date) {
        appointments = await db.sequelize.query(
            `SELECT * FROM appointment WHERE date BETWEEN "${start_date}" AND "${end_date}"`
        );
    } else {
        appointments = await db.appointment.findAll();
    }
    if (!appointments) {
        res.status(404).send("something went wrong");
    } else {
        res.status(200).json(appointments);
    }
});

router.post("/", auth, async (req, res) => {
    const { email } = req.user;
    const { date, time, issue } = req.body;
    if (!email || !date || !time || !issue) {
        res.status(404).send("something went wrong");
    } else {
        const citizen = await db.citizen.findOne({ where: { email: email } });
        const a = await citizen.createAppointment(req.body);
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
