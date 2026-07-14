const express = require("express");
const controller = require("../controllers/dashboardController");

const router = express.Router();

router.get("/", controller.index);

module.exports = router;