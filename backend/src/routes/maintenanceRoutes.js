const express = require("express");

const maintenanceController = require("../controllers/maintenanceController");
const { validate, schemas } = require("../middlewares/security");

const router = express.Router();

router.post("/", validate(schemas.maintenance), maintenanceController.create);

router.get("/", maintenanceController.index);

router.get("/:id", maintenanceController.show);

router.put("/:id", validate(schemas.maintenance), maintenanceController.update);

router.delete("/:id", maintenanceController.remove);

module.exports = router;