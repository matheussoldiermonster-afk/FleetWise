const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/dashboardController");

router.get("/", dashboardController.index);

router.get("/stats", dashboardController.stats);

module.exports = router;