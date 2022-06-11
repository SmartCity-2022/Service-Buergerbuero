const express = require("express");
const { Sequelize } = require("../models");
const router = express.Router();
const db = require("../models");

router.get("/", async (req, res) => {
    const id = req.query.id;
    let requests;
    if (id) {
        requests = await db.request.findOne({
            where: { id: id },
        });
    } else {
        requests = await db.request.findAll();
    }
    if (!requests) {
        res.status(404).send("something went wrong");
    } else {
        res.status(200).json(requests);
    }
});

router.post("/", async (req, res) => {
    const { email, type, desc } = req.body;
    if (!email || !type || !desc) {
        res.status(404).send("something went wrong");
    } else {
        const citizen = await db.citizen.findOne({ where: { email: email } });
        const request = await citizen.createRequest({
            type: type,
            desc: desc,
        });
        if (!request) {
            res.status(404).send("something went wrong");
        } else {
            res.status(201).json("success");
        }
    }
});

router.delete("/", async (req, res) => {
    const id = req.query.id;
    const del = await db.request.destroy({ where: { id: id } });
    if (!del) {
        res.status(404).send("something went wrong");
    } else {
        res.status(202).send("success");
    }
});

router.patch("/complete/", async (req, res) => {
    const { rid } = req.body;
    if (!rid) {
        res.status(404).send("something went wrong");
    } else {
        const na_date = new Date().toLocaleDateString();
        const split_date = na_date.split("/");
        const date = `${split_date[2]}-${split_date[1]}-${split_date[0]}`;
        let request = await db.request.update(
            {
                complete: true,
                completed_on: date,
            },
            { where: { id: rid } }
        );
        if (!request) {
            res.status(404).send("something went wrong");
        } else {
            res.status(202).send("success");
        }
    }
});

module.exports = router;
