const express = require("express");
const router = express.Router();
const db = require("../models");

router.get("/", async (req, res) => {
    const type = req.query.type;
    let lost_propertylist;
    if (type) {
        lost_propertylist = await db.lost_property.findAll({
            where: { type: type },
        });
    } else {
        lost_propertylist = await db.lost_property.findAll();
    }

    if (!lost_propertylist) {
        res.status(404).send("something went wrong");
    } else {
        res.status(200).json(lost_propertylist);
    }
});

router.post("/", async (req, res) => {
    const lp = await db.lost_property.create(req.body);
    if (!lp) {
        res.status(404).send("something went wrong");
    } else {
        res.status(201).json(lp);
    }
});

router.delete("/", async (req, res) => {
    const id = req.query.id;
    const del = await db.lost_property.destroy({ where: { id: id } });
    if (!del) {
        res.status(404).send("something went wrong");
    } else {
        res.status(202).send("success");
    }
});

module.exports = router;
