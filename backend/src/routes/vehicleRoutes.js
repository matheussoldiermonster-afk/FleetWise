const express = require("express");

const controller = require("../controllers/vehicleController");
const { validate, schemas } = require("../middlewares/security");

const router = express.Router();

router.get("/", controller.index);
router.post("/", validate(schemas.vehicle), controller.create);
router.put("/:id", validate(schemas.vehicle), controller.update);
router.delete("/:id", controller.remove);

module.exports = router;