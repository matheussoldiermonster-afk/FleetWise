const express = require("express");
const controller = require("../controllers/fuelingController");

const router = express.Router();

router.post("/", controller.create);

module.exports = router;