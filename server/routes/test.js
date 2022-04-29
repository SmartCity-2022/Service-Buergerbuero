const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    console.log("test get called");
    res.json("frontend - backend connection working");
});

module.exports = router;
