const express = require("express");
const router = express.Router();
const db = require("../models");

router.get("/", async (req, res) => {
    const feedbacklist = await db.feedback.findAll();
    if (!feedbacklist) {
        res.status(404).send("something went wrong");
    } else {
        res.status(200).json(feedbacklist);
    }
});

router.post("/", async (req, res) => {
    const fb = await db.feedback.create(req.body);
    if (!fb) {
        res.status(404).send("something went wrong");
    } else {
        res.status(201).json(fb);
    }
});

router.delete("/", async (req, res) => {
    const id = req.query.id;
    const del = await db.feedback.destroy({ where: { id: id } });
    if (!del) {
        res.status(404).send("something went wrong");
    } else {
        res.status(202).send("success");
    }
});

module.exports = router;
