const express = require("express");
const notificationController = require("../controllers/notificationController");

const router = express.Router();

router.get("/", notificationController.index);
router.post("/dismiss", notificationController.dismiss);

module.exports = router;
