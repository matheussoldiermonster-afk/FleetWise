const express = require("express");
const controller = require("../controllers/technicianController");

const router = express.Router();

router.post("/", controller.create);

module.exports = router;